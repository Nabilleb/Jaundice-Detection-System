import subprocess
import tkinter as tk
from tkinter import filedialog, messagebox
import pandas as pd
import xgboost as xgb
from PIL import Image, ImageTk
import numpy as np
def run_script(script_name):
    subprocess.run(['python', script_name], check=True)

def main():
    # Run extract.py
    run_script('extract.py')

    # Run jaundice.py
    run_script('jaundice.py')



# Load the trained XGBoost model
model = xgb.XGBClassifier()
model.load_model("xgboost_model.json")

def preprocess_image(image_path):
    try:
        # Open and resize the image to 250x250
        image = Image.open(image_path).resize((250, 250))
        image_array = np.array(image)

        # Extract features as done during the model training
        red = np.mean(image_array[:, :, 0])
        green = np.mean(image_array[:, :, 1])
        blue = np.mean(image_array[:, :, 2])
        Y = 0.299 * red + 0.587 * green + 0.114 * blue  # Luminance calculation
        cblue = 255 - blue
        cred = 255 - red

        # Convert to DataFrame with feature names
        features_df = pd.DataFrame([[red, green, blue, Y, cblue, cred]],
                                    columns=['red', 'green', 'blue', 'Y', 'cblue', 'cred'])
        return features_df
    except Exception as e:
        messagebox.showerror("Error", f"Failed to process image: {e}")
        return None

def predict_jaundice():
    file_path = filedialog.askopenfilename()
    if not file_path:  # No file was selected
        messagebox.showinfo("No Selection", "No image selected. Please select an image.")
        return

    features_df = preprocess_image(file_path)
    if features_df is not None:
        prediction = model.predict(features_df)
        result_text = "Jaundice Detected" if prediction[0] == 1 else "No Jaundice Detected"
        if (result_text == "Jaundice Detected"):
            label.config(text=f"{result_text}", fg="red")
        else:
            label.config(text=f"{result_text}", fg="green")

        # Show the image
        img = Image.open(file_path)
        img = img.resize((250, 250), Image.LANCZOS)
        img = ImageTk.PhotoImage(img)
        panel.configure(image=img)
        panel.image = img


def add_logo_to_gui(root, logo_path):
    try:
        # Load the logo image
        logo_img = Image.open(logo_path)
        logo_img = logo_img.resize((200, 100), Image.LANCZOS)   # Resize the logo (You can change the size as needed)
        logo_photo = ImageTk.PhotoImage(logo_img)

        # Create a label to display the logo
        logo_label = tk.Label(root, image=logo_photo, bg='light blue')
        logo_label.image = logo_photo
        logo_label.pack(pady=20)
    except Exception as e:
        messagebox.showerror("Error", f"Failed to load the logo image: {e}")

root = tk.Tk()
root.title("Jaundice Detection")
root.geometry('800x600')

# Test script to check if the file can be opened
with open('xgboost_model.json', 'r') as file:
    print("File can be accessed")
print("didn't work")


root.configure(bg='light blue')
font_style = ("Verdana", 12, "bold")
button_style = {'font': font_style, 'bg': 'navy', 'fg': 'white'}


add_logo_to_gui(root, "logo.png")

# Create the rest of the GUI elements
btn_predict = tk.Button(root, text="Select Image & Predict Jaundice", command=predict_jaundice, **button_style)
btn_predict.pack(pady=20)

panel = tk.Label(root, bg='light blue')
panel.pack()

label = tk.Label(text="", font=("Sans Serif", 25, "bold"), bg='light blue')
label.pack(pady=20)

root.mainloop()

if __name__ == '__main__':
    main()
