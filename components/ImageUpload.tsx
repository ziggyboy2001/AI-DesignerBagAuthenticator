import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeContext';

interface ImageUploadProps {
  onImageSelected: (uri: string) => void;
}

export default function ImageUpload({ onImageSelected }: ImageUploadProps) {
  const [image, setImage] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { theme } = useTheme();

  React.useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(cameraStatus === 'granted' && mediaStatus === 'granted');
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  if (hasPermission === null) {
    return (
      <View style={[styles.container, { padding: theme.spacing.lg }]}>
        <Text style={{
          color: theme.colors.text,
          fontFamily: theme.typography.body.fontFamily,
          fontSize: theme.typography.body.fontSize,
        }}>Requesting permissions...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={[styles.container, { padding: theme.spacing.lg }]}>
        <Text style={{
          color: theme.colors.text,
          fontFamily: theme.typography.body.fontFamily,
          fontSize: theme.typography.body.fontSize,
        }}>No access to camera or gallery</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { padding: theme.spacing.lg }]}>
      {image ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={[styles.image, {
            width: 300,
            height: 300,
            borderRadius: theme.borderRadius.lg,
            marginBottom: theme.spacing.lg,
          }]} />
          <TouchableOpacity 
            style={[styles.retakeButton, {
              backgroundColor: theme.colors.error,
              padding: theme.spacing.md,
              borderRadius: theme.borderRadius.md,
              width: 120,
              alignItems: 'center',
            }]}
            onPress={() => setImage(null)}
          >
            <Text style={{
              color: theme.colors.white,
              fontSize: theme.typography.body.fontSize,
              fontFamily: theme.typography.h3.fontWeight,
            }}>Retake</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.uploadContainer, {
          padding: theme.spacing.lg,
          backgroundColor: theme.colors.background,
          borderRadius: theme.borderRadius.lg,
        }]}>
          <Text style={{
            fontSize: theme.typography.h1.fontSize,
            fontFamily: theme.typography.h1.fontWeight,
            color: theme.colors.text,
            marginBottom: theme.spacing.xs,
          }}>Upload Bag Image</Text>
          <Text style={{
            fontSize: theme.typography.body.fontSize,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginBottom: theme.spacing.xl,
            fontFamily: theme.typography.body.fontFamily,
          }}>
            Take a photo or choose from your gallery to authenticate your bag
          </Text>
          <View style={[styles.uploadOptions, { gap: theme.spacing.lg }]}>
            <TouchableOpacity 
              style={[styles.optionButton, {
                backgroundColor: theme.colors.primary,
                padding: theme.spacing.lg,
                borderRadius: theme.borderRadius.md,
                alignItems: 'center',
                flex: 1,
                minWidth: 140,
              }]} 
              onPress={takePhoto}
            >
              <View style={[styles.iconContainer, { marginBottom: theme.spacing.xs }]}>
                <MaterialIcons name="camera-alt" size={32} color={theme.colors.white} />
              </View>
              <Text style={{
                color: theme.colors.white,
                fontSize: theme.typography.body.fontSize,
                fontFamily: theme.typography.h3.fontWeight,
                textAlign: 'center',
              }}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.optionButton, {
                backgroundColor: theme.colors.primary,
                padding: theme.spacing.lg,
                borderRadius: theme.borderRadius.md,
                alignItems: 'center',
                flex: 1,
                minWidth: 140,
              }]} 
              onPress={pickImage}
            >
              <View style={[styles.iconContainer, { marginBottom: theme.spacing.xs }]}>
                <MaterialIcons name="photo-library" size={32} color={theme.colors.white} />
              </View>
              <Text style={{
                color: theme.colors.white,
                fontSize: theme.typography.body.fontSize,
                fontFamily: theme.typography.h3.fontWeight,
                textAlign: 'center',
              }}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadContainer: {
    width: '100%',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
  },
  image: {
  },
  uploadOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  optionButton: {
  },
  iconContainer: {
  },
  optionButtonText: {
  },
  retakeButton: {
  },
  retakeButtonText: {
  },
}); 