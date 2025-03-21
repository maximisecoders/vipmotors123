import { supabase } from './supabase';
import { uploadCarImage } from './storage';

export const addNewCar = async (carData: Omit<Car, 'id' | 'image' | 'images' | 'folder_path'>, mainImage: File, additionalImages: File[]) => {
  try {
    // 1. Insert car data first to get the ID
    const { data: car, error: insertError } = await supabase
      .from('cars')
      .insert([carData])
      .select()
      .single();

    if (insertError) throw insertError;

    // 2. Upload main image
    const mainImageUrl = await uploadCarImage(car.id, mainImage);

    // 3. Upload additional images
    const imageUrls = await Promise.all(
      additionalImages.map(file => uploadCarImage(car.id, file))
    );

    // 4. Update car record with image URLs
    const { error: updateError } = await supabase
      .from('cars')
      .update({
        image: mainImageUrl,
        images: imageUrls,
        folder_path: `carimage/${car.id}`
      })
      .eq('id', car.id);

    if (updateError) throw updateError;

    return car;
  } catch (error) {
    console.error('Error adding new car:', error);
    throw error;
  }
}; 