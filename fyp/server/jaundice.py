import pandas as pd
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score

try:
    # Load the dataset
    file_path = "new_train.csv"  # Ensure this path is correct
    data = pd.read_csv(file_path)

    # Check if 'ID' column exists and drop it if it does
    if 'ID' in data.columns:
        data = data.drop(['ID'], axis=1)

    # Separate the features and the target
    X = data.drop(['class'], axis=1)
    y = data['class']

    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Initialize the XGBoost classifier
    xgb_model = XGBClassifier(use_label_encoder=False, eval_metric='mlogloss')

    # Train the model
    xgb_model.fit(X_train, y_train)

    # Predict the labels for the test set
    y_pred = xgb_model.predict(X_test)

    # Evaluate the model
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy:.2f}")

    # Save the model for future use
    xgb_model.save_model('xgboost_model.json')

except pd.errors.EmptyDataError:
    print("Error: The CSV file is empty or does not exist.")
except FileNotFoundError:
    print("Error: The file was not found.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
