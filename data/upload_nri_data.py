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


def upload_csv_to_firebase_from_offset(csv_path, db_ref, start_index, batch_size=500):
    with open(csv_path, mode="r") as file:
        csv_reader = csv.DictReader(file)

        # Fetch all existing ZIP codes once to avoid multiple reads
        existing_zip_codes = set(db_ref.get().keys() if db_ref.get() else [])

        # Skip rows up to the start index
        for _ in range(start_index):
            next(csv_reader, None)

        batch = {}
        count = 0

        for row in csv_reader:
            # Use ZIP as a unique key
            zip_code = row["STCOUNTYFP"]

            # Check if the ZIP code already exists in memory
            if zip_code not in existing_zip_codes:
                batch[zip_code] = {
                    "risk_score": row["RISK_SCORE"],
                    "eal_score": row["EAL_SCORE"],
                    "earthquake_risk_score": row["ERQK_RISKS"],  # Earthquake Risk Score
                    "riverine_flooding_risk_score": row[
                        "RFLD_RISKS"
                    ],  # Riverine Flooding Risk Score
                    "coastal_flooding_risk_score": row[
                        "CFLD_RISKS"
                    ],  # Coastal Flooding Risk Score
                    "hurricane_risk_score": row["HRCN_RISKS"],  # Hurricane Risk Score
                    "tornado_risk_score": row["TRND_RISKS"],  # Tornado Risk Score
                    "wildfire_risk_score": row["WFIR_RISKS"],  # Wildfire Risk Score
                    "winter_weather_risk_score": row[
                        "WNTW_RISKS"
                    ],  # Winter Weather Risk Score
                    "heat_wave_risk_score": row["HWAV_RISKS"],  # Heat Wave Risk Score
                    "drought_risk_score": row["DRGT_RISKS"],  # Drought Risk Score
                    "hail_risk_score": row["HAIL_RISKS"],  # Hail Risk Score
                    "strong_wind_risk_score": row[
                        "SWND_RISKS"
                    ],  # Strong Wind Risk Score
                }

                existing_zip_codes.add(zip_code)
                count += 1

            # Write the batch when it reaches the batch size
            if count >= batch_size:
                db_ref.update(batch)
                batch.clear()
                count = 0
                print(f"Uploaded a batch of {batch_size} records.")

        # Write any remaining records
        if batch:
            db_ref.update(batch)
            print(f"Uploaded final batch of {len(batch)} records.")


# Call the function to upload data starting at item 16000
upload_csv_to_firebase_from_offset(csv_file_path, ref, 0)

print("Data upload completed!")
