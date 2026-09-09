import json
import logging

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import CarMake, CarModel
from .populate import initiate
from .restapis import analyze_review_sentiments, get_request, post_review


logger = logging.getLogger(__name__)


def _json_body(request):
    try:
        return json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return {}


@csrf_exempt
def login_user(request):
    if request.method != "POST":
        return JsonResponse({"status": "Method Not Allowed"}, status=405)

    data = _json_body(request)
    username = data.get("userName", "")
    password = data.get("password", "")
    user = authenticate(username=username, password=password)
    if user is None:
        return JsonResponse(
            {"userName": username, "status": "Unauthenticated"},
            status=401,
        )

    login(request, user)
    return JsonResponse(
        {
            "userName": username,
            "firstName": user.first_name,
            "lastName": user.last_name,
            "status": "Authenticated",
        }
    )


def logout_request(request):
    username = request.user.username if request.user.is_authenticated else ""
    logout(request)
    return JsonResponse({"userName": "", "loggedOutUser": username})


@csrf_exempt
def registration(request):
    if request.method != "POST":
        return JsonResponse({"status": "Method Not Allowed"}, status=405)

    data = _json_body(request)
    username = data.get("userName", "").strip()
    password = data.get("password", "")
    if not username or not password:
        return JsonResponse(
            {"status": False, "error": "Username and password are required"},
            status=400,
        )
    if User.objects.filter(username=username).exists():
        return JsonResponse(
            {"status": False, "error": "Already Registered"},
            status=409,
        )

    user = User.objects.create_user(
        username=username,
        password=password,
        first_name=data.get("firstName", "").strip(),
        last_name=data.get("lastName", "").strip(),
        email=data.get("email", "").strip(),
    )
    login(request, user)
    return JsonResponse(
        {
            "userName": username,
            "firstName": user.first_name,
            "lastName": user.last_name,
            "status": "Authenticated",
        },
        status=201,
    )


def get_dealerships(request, state="All"):
    endpoint = "/fetchDealers" if state == "All" else f"/fetchDealers/{state}"
    dealerships = get_request(endpoint)
    return JsonResponse({"status": 200, "dealers": dealerships})


def get_dealer_details(request, dealer_id):
    dealership = get_request(f"/fetchDealer/{dealer_id}")
    return JsonResponse({"status": 200, "dealer": dealership})


def get_dealer_reviews(request, dealer_id):
    reviews = get_request(f"/fetchReviews/dealer/{dealer_id}")
    for review_detail in reviews:
        response = analyze_review_sentiments(review_detail.get("review", ""))
        review_detail["sentiment"] = response.get("sentiment", "neutral")
    return JsonResponse({"status": 200, "reviews": reviews})


@csrf_exempt
def add_review(request):
    if not request.user.is_authenticated:
        return JsonResponse(
            {"status": 403, "message": "Unauthorized"},
            status=403,
        )
    if request.method != "POST":
        return JsonResponse(
            {"status": 405, "message": "Method Not Allowed"},
            status=405,
        )

    response = post_review(_json_body(request))
    if response is None:
        return JsonResponse(
            {"status": 502, "message": "Error in posting review"},
            status=502,
        )
    return JsonResponse(
        {"status": 200, "message": "Review posted successfully", "review": response}
    )


def get_cars(request):
    if CarMake.objects.count() == 0:
        initiate()
    cars = [
        {
            "CarModel": car_model.name,
            "CarMake": car_model.car_make.name,
            "CarType": car_model.get_type_display(),
            "CarYear": car_model.year,
        }
        for car_model in CarModel.objects.select_related("car_make").order_by(
            "car_make__name",
            "name",
        )
    ]
    return JsonResponse({"CarModels": cars})
