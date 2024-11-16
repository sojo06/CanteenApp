from flask import Flask, request, jsonify
import os
from PIL import Image, ImageDraw, ImageFont
import joblib
from face_recognition import preprocessing

app = Flask(__name__)
CORS(app)

# Define paths
MODEL_FILE_PATH = "model/frames_trained.pkl"  # Path to the face recognition model
IMAGES_FOLDER_PATH = "images"  # Folder to save uploaded images
OUTPUT_FOLDER_PATH = "Output_images"  # Directory to save processed images

# Ensure folders exist
os.makedirs(IMAGES_FOLDER_PATH, exist_ok=True)
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
        # Print request data and files for debugging
        print("Received request data:", request.data)
        print("Received files:", request.files)

        # Get the image file from the request
        image_file = request.files.get('image')  # Expecting 'image' as the field name
        if not image_file:
            return jsonify({'error': 'No image file provided'}), 400

        # Save the image first to the 'images' folder
        image_filename = image_file.filename
        image_path = os.path.join(IMAGES_FOLDER_PATH, image_filename)
        image_file.save(image_path)
        print(f"Image saved at {image_path}")

        # Read the image from the file after saving it
        image = Image.open(image_path)
        print("Image received and decoded")

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

        # Save the processed image in the Output_images folder
        output_image_filename = f"processed_{image_filename}"
        output_image_path = os.path.join(OUTPUT_FOLDER_PATH, output_image_filename)
        image.save(output_image_path)

        # Return the processed image path and recognition results
        return jsonify({
            'message': 'Image processed successfully',
            'output_path': output_image_path,
            'recognition_results': recognition_results
        })

    except Exception as e:
        print(f"Error: {e}")  # Log the error for debugging
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
