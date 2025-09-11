import { supabase } from "@/integrations/supabase/client";

export interface PhotoUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const uploadPhotoToStorage = async (
  file: File,
  userId: string,
  bucket: string = 'avatars'
): Promise<PhotoUploadResult> => {
  try {
    // Validate file
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'Arquivo deve ser uma imagem'
      };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'Arquivo deve ter no máximo 5MB'
      };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar.${fileExt}`;

    console.log('Uploading photo to storage:', { fileName, fileSize: file.size, fileType: file.type });

    // Delete existing avatar if it exists
    try {
      await supabase.storage.from(bucket).remove([fileName]);
    } catch (error) {
      console.log('No existing avatar to delete or error deleting:', error);
    }

    // Upload new file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Storage upload error:', error);
      return {
        success: false,
        error: `Erro ao fazer upload: ${error.message}`
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    console.log('Photo uploaded successfully:', { path: data.path, url: urlData.publicUrl });

    return {
      success: true,
      url: urlData.publicUrl
    };

  } catch (error) {
    console.error('Unexpected error during photo upload:', error);
    return {
      success: false,
      error: 'Erro inesperado ao fazer upload da foto'
    };
  }
};

export const deletePhotoFromStorage = async (
  userId: string,
  bucket: string = 'avatars'
): Promise<{ success: boolean; error?: string }> => {
  try {
    // List all files for this user
    const { data: files, error: listError } = await supabase.storage
      .from(bucket)
      .list(userId);

    if (listError) {
      console.error('Error listing files:', listError);
      return { success: false, error: listError.message };
    }

    if (!files || files.length === 0) {
      return { success: true }; // Nothing to delete
    }

    // Delete all files for this user
    const filesToDelete = files.map(file => `${userId}/${file.name}`);
    const { error: deleteError } = await supabase.storage
      .from(bucket)
      .remove(filesToDelete);

    if (deleteError) {
      console.error('Error deleting files:', deleteError);
      return { success: false, error: deleteError.message };
    }

    console.log('Photos deleted successfully for user:', userId);
    return { success: true };

  } catch (error) {
    console.error('Unexpected error during photo deletion:', error);
    return { success: false, error: 'Erro inesperado ao deletar foto' };
  }
};