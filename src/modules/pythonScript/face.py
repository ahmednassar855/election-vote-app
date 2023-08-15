import cv2
import face_recognition
import sys

folder_dir = "pythonScript"

faceImage1 = sys.argv[1]
faceImage2 = sys.argv[2]
# faceImage3 = sys.argv[3]
# print(faceImage3)

image1=cv2.imread(faceImage1)
rgbimage1=cv2.cvtColor(image1,  cv2.COLOR_BGR2RGB)

img_encoding1 = face_recognition.face_encodings(rgbimage1)[0]

image2 = cv2.imread(faceImage2)
rgbimage2 = cv2.cvtColor(image2, cv2.COLOR_BGR2RGB)
img_encoding2 = face_recognition.face_encodings(rgbimage2)[0]


result = face_recognition.compare_faces([img_encoding1], img_encoding2)

print(result[0])

