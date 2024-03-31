from PIL import Image
import numpy as np
import pandas as pd
import os

def calculate_image_features(image_path):
    try:
        image = Image.open(image_path)
        image_array = np.array(image)
        red = np.mean(image_array[:, :, 0])
        green = np.mean(image_array[:, :, 1])
        blue = np.mean(image_array[:, :, 2])
        Y = 0.299 * red + 0.587 * green + 0.114 * blue
        cblue = 255 - blue
        cred = 255 - red
        return red, green, blue, Y, cblue, cred
    except Exception as e:
        print(f"Error processing image {image_path}: {e}")
        return None

def process_images_from_directory(directory, label):
    try:
        files = os.listdir(directory)
    except FileNotFoundError:
        print(f"Directory not found: {directory}")
        return pd.DataFrame(columns=['red', 'green', 'blue', 'Y', 'cblue', 'cred', 'class'])

    data = []
    for file in files:
        file_path = os.path.join(directory, file)
        features = calculate_image_features(file_path)
        if features:
            data.append(features + (label,))
    if data:
        df = pd.DataFrame(data, columns=['red', 'green', 'blue', 'Y', 'cblue', 'cred', 'class'])
    else:
        df = pd.DataFrame(columns=['red', 'green', 'blue', 'Y', 'cblue', 'cred', 'class'])
    return df

# Paths to the image directories
extract_dir_normal = r'C:\Users\nabil\Desktop\normal'
extract_dir_jaundice = r'C:\Users\nabil\Desktop\jaundice'

try:
    # Process images for both classes
    df_normal = process_images_from_directory(extract_dir_normal, 0)  # Label 0 for normal
    df_jaundice = process_images_from_directory(extract_dir_jaundice, 1)  # Label 1 for jaundice

    # Combine the dataframes
    df_combined = pd.concat([df_normal, df_jaundice], ignore_index=True)

    # Save to CSV
    df_combined.to_csv('new_train.csv', index=False)
    print("CSV file has been created successfully.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
