import { supabase, getStorageUrl } from './supabase';

export const getCarImageUrl = (carId: number, imageName: string) => {
  return getStorageUrl(`${carId}/${imageName}`);
};

export const uploadCarImage = async (carId: number, file: File) => {
  const fileName = `${Date.now()}-${file.name}`;
  
  const { data, error } = await supabase
    .storage
    .from('carimages')
    .upload(`${carId}/${fileName}`, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw error;
  }

  return getStorageUrl(`${carId}/${fileName}`);
};

export const deleteCarImage = async (carId: number, imageName: string) => {
  const { error } = await supabase
    .storage
    .from('carimages')
    .remove([`${carId}/${imageName}`]);

  if (error) {
    throw error;
  }
}; 