from .models import CarMake, CarModel


def initiate():
    car_make_data = [
        {"name": "NISSAN", "description": "Japanese engineering and dependable SUVs."},
        {"name": "Mercedes", "description": "Premium German design and technology."},
        {"name": "Audi", "description": "German performance, comfort, and innovation."},
        {"name": "Kia", "description": "Practical Korean vehicles with modern features."},
        {"name": "Toyota", "description": "Reliable Japanese cars for everyday driving."},
    ]
    makes = {}
    for data in car_make_data:
        make, _ = CarMake.objects.get_or_create(
            name=data["name"],
            defaults={"description": data["description"]},
        )
        makes[data["name"]] = make

    car_model_data = [
        ("NISSAN", "Pathfinder", "SUV"),
        ("NISSAN", "Qashqai", "SUV"),
        ("NISSAN", "XTRAIL", "SUV"),
        ("Mercedes", "A-Class", "SEDAN"),
        ("Mercedes", "C-Class", "SEDAN"),
        ("Mercedes", "E-Class", "SEDAN"),
        ("Audi", "A4", "SEDAN"),
        ("Audi", "A5", "SEDAN"),
        ("Audi", "A6", "SEDAN"),
        ("Kia", "Sorrento", "SUV"),
        ("Kia", "Carnival", "WAGON"),
        ("Kia", "Cerato", "SEDAN"),
        ("Toyota", "Corolla", "SEDAN"),
        ("Toyota", "Camry", "SEDAN"),
        ("Toyota", "Kluger", "SUV"),
    ]
    for make_name, model_name, car_type in car_model_data:
        CarModel.objects.get_or_create(
            car_make=makes[make_name],
            name=model_name,
            defaults={"type": car_type, "year": 2023},
        )
