# import io
# import joblib
# from PIL import Image, ImageDraw, ImageFont
# from face_recognition import preprocessing
# import os

# # Specify local paths for model, input image, and output directory
# model_file_path = "model/frames_trained.pkl"  # Local path for the face recognition model
# image_file_path = "images/WIN_20241113_16_26_28_Pro.jpg"  # Local path for the input image
# output_folder_path = "Output_images"  # Folder to save the processed image

# # Ensure the output folder exists
# os.makedirs(output_folder_path, exist_ok=True)

# # Load the face recognizer model from a local file
# def load_face_recogniser_model():
#     with open(model_file_path, 'rb') as model_file:
#         return joblib.load(model_file)

# # Initialize face recognizer model
# face_recogniser = load_face_recogniser_model()

# # Preprocess function
# preprocess = preprocessing.ExifOrientationNormalize()

# # Load and preprocess the image
# img = Image.open(image_file_path)
# img = preprocess(img)
# img = img.convert('RGB')  # Convert image to RGB (stripping alpha channel if exists)

# # Perform face recognition
# faces = face_recogniser(img)

# # Draw bounding boxes and labels on the image
# draw = ImageDraw.Draw(img)
# font = ImageFont.load_default()  # You can load a custom font if necessary

# # Display recognition results
# print("Recognition Results:")
# if faces:
#     for idx, face in enumerate(faces):
#         print(f"Face {idx + 1}:")
#         print(f"Top Prediction: {face.top_prediction.label} (Confidence: {face.top_prediction.confidence:.2f})")
#         print(f"Bounding Box: Left: {face.bb.left}, Top: {face.bb.top}, Right: {face.bb.right}, Bottom: {face.bb.bottom}")
        
#         # Draw bounding box
#         draw.rectangle([face.bb.left, face.bb.top, face.bb.right, face.bb.bottom], outline="red", width=2)
        
#         # Prepare label text and its size
#         label_text = f"{face.top_prediction.label} ({face.top_prediction.confidence:.2f})"
#         text_bbox = draw.textbbox((face.bb.left, face.bb.top - 10), label_text, font=font)
#         text_width = text_bbox[2] - text_bbox[0]
#         text_height = text_bbox[3] - text_bbox[1]
        
#         # Draw black rectangle for label background
#         draw.rectangle([face.bb.left, face.bb.top - text_height, face.bb.left + text_width, face.bb.top], fill="black")
        
#         # Draw white label text
#         draw.text((face.bb.left, face.bb.top - text_height), label_text, fill="white", font=font)
# else:
#     print("No faces detected.")

# # Save the processed image in the specified folder
# output_image_path = os.path.join(output_folder_path, "processed_image.jpg")
# img.save(output_image_path)
# print(f"Processed image saved at {output_image_path}")
from flask import Flask, request, jsonify
import os
import base64
from PIL import Image, ImageDraw, ImageFont
import io
import joblib
from face_recognition import preprocessing

app = Flask(__name__)

# Define paths
MODEL_FILE_PATH = "model/frames_trained.pkl"  # Path to the face recognition model
OUTPUT_FOLDER_PATH = "Output_images"  # Directory to save processed images

# Ensure output folder exists
os.makedirs(OUTPUT_FOLDER_PATH, exist_ok=True)

# Load the face recognition model
def load_face_recogniser_model():
    with open(MODEL_FILE_PATH, 'rb') as model_file:
        return joblib.load(model_file)

# Initialize face recognizer model
face_recogniser = load_face_recogniser_model()

# Preprocess function
preprocess = preprocessing.ExifOrientationNormalize()

@app.route('/process-image', methods=['POST'])
def process_image():
    try:
        # Get the Base64-encoded image from the request
        data = request.json
        base64_image = data.get('file')
        print("ok")
        if not base64_image:
            return jsonify({'error': 'No image data provided'}), 400

        # Decode the Base64 image
        image_data = base64.b64decode(base64_image)
        image = Image.open(io.BytesIO(image_data))
        print("encoding done")
        # Preprocess the image
        image = preprocess(image)
        image = image.convert('RGB')  # Ensure the image is in RGB format

        # Perform face recognition
        faces = face_recogniser(image)

        # Draw bounding boxes and labels on the image
        draw = ImageDraw.Draw(image)
        font = ImageFont.load_default()  # You can load a custom font if necessary
        recognition_results = []

        if faces:
            for idx, face in enumerate(faces):
                recognition_results.append({
                    'face_id': idx + 1,
                    'label': face.top_prediction.label,
                    'confidence': face.top_prediction.confidence,
                    'bounding_box': {
                        'left': face.bb.left,
                        'top': face.bb.top,
                        'right': face.bb.right,
                        'bottom': face.bb.bottom
                    }
                })

                # Draw bounding box
                draw.rectangle([face.bb.left, face.bb.top, face.bb.right, face.bb.bottom], outline="red", width=2)

                # Prepare label text and draw it
                label_text = f"{face.top_prediction.label} ({face.top_prediction.confidence:.2f})"
                draw.text((face.bb.left, face.bb.top - 10), label_text, fill="white", font=font)

        else:
            recognition_results.append({'message': 'No faces detected'})

        # Save the processed image
        output_image_path = os.path.join(OUTPUT_FOLDER_PATH, "processed_image.jpg")
        image.save(output_image_path)

        return jsonify({
            'message': 'Image processed successfully',
            'output_path': output_image_path,
            'recognition_results': recognition_results
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
