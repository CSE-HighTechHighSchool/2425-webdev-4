import csv
import firebase_admin
from firebase_admin import credentials, db

# Initialize Firebase Admin SDK
cred = credentials.Certificate("se-website-project-firebase-adminsdk-nyej3-a4fe3576c7.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://se-website-project-default-rtdb.firebaseio.com'
})

# Path to your CSV file
csv_file_path = "county_data.csv"

# Firebase database reference
ref = db.reference('postal_codes')

def upload_csv_to_firebase_from_offset(csv_path, db_ref, start_index, batch_size=500):
    with open(csv_path, mode='r') as file:
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
            zip_code = row['ZIP']
            
            # Check if the ZIP code already exists in memory
            if zip_code not in existing_zip_codes:
                batch[zip_code] = {
                    'county_name': row['COUNTYNAME'],
                    'state': row['STATE'],
                    'stcountyfp': row['STCOUNTYFP'],
                    'classfp': row['CLASSFP']
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
upload_csv_to_firebase_from_offset(csv_file_path, ref, 16000)

print("Data upload completed!")
