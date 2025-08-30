# How to Add Your Profile Photo

## Steps to use your actual photo:

1. **Save your photo**: Save the image you provided as `profile.jpg` in the `public` folder of your portfolio project.

2. **Update the image source**: In `src/App.tsx`, find the profile image section and change:
   ```tsx
   src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
   ```
   to:
   ```tsx
   src="/profile.jpg"
   ```

3. **Alternative**: You can also upload your image to a cloud service like:
   - Cloudinary
   - ImgBB
   - GitHub (in your repository)
   - Any image hosting service

## Current Setup:
- I've temporarily used a professional placeholder image that matches your style
- The image is properly styled with a gradient border and responsive design
- Once you add your actual photo, it will display perfectly in the portfolio

## Your Photo Details:
- Professional headshot ✅
- Good lighting ✅
- Professional attire (traditional Filipino formal wear) ✅
- Perfect for a portfolio! ✅

Simply follow the steps above to use your actual photo instead of the placeholder.
