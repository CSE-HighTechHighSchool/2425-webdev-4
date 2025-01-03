import csv
import firebase_admin
from firebase_admin import credentials, db

# Initialize Firebase Admin SDK
cred = credentials.Certificate(
    "se-website-project-firebase-adminsdk-nyej3-a4fe3576c7.json"
)
firebase_admin.initialize_app(
    cred, {"databaseURL": "https://se-website-project-default-rtdb.firebaseio.com"}
)

# Path to your CSV file
csv_file_path = "nri_data.csv"

# Firebase database reference
ref = db.reference("risk_scores")

def update_existing_records_with_new_features(csv_path, db_ref):
    with open(csv_path, mode="r") as file:
        csv_reader = csv.DictReader(file)

        # Fetch all existing records
        existing_records = db_ref.get() or {}

        batch = {}
        count = 0
        batch_size = 500

        for row in csv_reader:
            # Use ZIP as a unique key
            zip_code = row["STCOUNTYFP"]

            # If the record exists, update it with additional features
            if zip_code in existing_records:
                batch[zip_code] = {
                    "risk_score": row["RISK_SCORE"],
                    "eal_score": row["EAL_SCORE"],
                    "earthquake_risk_score": row["ERQK_RISKS"],
                    "earthquake_eal_score": row["ERQK_EALS"],
                    "riverine_flooding_risk_score": row["RFLD_RISKS"],
                    "riverine_flooding_eal_score": row["RFLD_EALS"],
                    "coastal_flooding_risk_score": row["CFLD_RISKS"],
                    "coastal_flooding_eal_score": row["CFLD_EALS"],
                    "hurricane_risk_score": row["HRCN_RISKS"],
                    "hurricane_eal_score": row["HRCN_EALS"],
                    "tornado_risk_score": row["TRND_RISKS"],
                    "tornado_eal_score": row["TRND_EALS"],
                    "wildfire_risk_score": row["WFIR_RISKS"],
                    "wildfire_eal_score": row["WFIR_EALS"],
                    "winter_weather_risk_score": row["WNTW_RISKS"],
                    "winter_weather_eal_score": row["WNTW_EALS"],
                    "heat_wave_risk_score": row["HWAV_RISKS"],
                    "heat_wave_eal_score": row["HWAV_EALS"],
                    "drought_risk_score": row["DRGT_RISKS"],
                    "drought_eal_score": row["DRGT_EALS"],
                    "hail_risk_score": row["HAIL_RISKS"],
                    "hail_eal_score": row["HAIL_EALS"],
                    "strong_wind_risk_score": row["SWND_RISKS"],
                    "strong_wind_eal_score": row["SWND_EALS"],
                }
                count += 1

            # Write the batch when it reaches the batch size
            if count >= batch_size:
                db_ref.update(batch)
                batch.clear()
                count = 0
                print(f"Updated a batch of {batch_size} records.")

        # Write any remaining records
        if batch:
            db_ref.update(batch)
            print(f"Updated final batch of {len(batch)} records.")

# Call the function to update existing data with new features
update_existing_records_with_new_features(csv_file_path, ref)

print("Data update completed!")
