import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Camera as CameraIcon, RotateCcw, ImageIcon } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeContext';

const { width, height } = Dimensions.get('window');

interface CameraProps {
  onPhotoTaken: (uri: string) => void;
  imageUri: string | null;
}

export default function Camera({ onPhotoTaken, imageUri }: CameraProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<'on' | 'off'>('off');
  const cameraRef = useRef<any>(null);
  const insets = useSafeAreaInsets();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const { theme } = useTheme();

  const triggerHaptic = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, []);

  const handleCameraReady = useCallback(() => {
    setIsCameraReady(true);
  }, []);

  const takePicture = useCallback(async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: true,
        });
        onPhotoTaken(photo.uri);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  }, [isCameraReady, onPhotoTaken]);

  const pickImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        onPhotoTaken(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  }, [onPhotoTaken]);

  useEffect(() => {
    (async () => {
      if (!permission?.granted) {
        await requestPermission();
      }
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission?.granted && mediaStatus === 'granted') {
        setIsCameraReady(true);
      }
    })();
  }, [permission, requestPermission]);

  if (!permission) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.black }]}>
        <Text style={[styles.text, {
          color: theme.colors.white,
          fontFamily: theme.typography.body.fontFamily,
          fontSize: theme.typography.body.fontSize,
        }]}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.black }]}>
        <BlurView intensity={80} style={styles.permissionContainer}>
          <CameraIcon color={theme.colors.white} size={48} />
          <Text style={[styles.permissionTitle, {
            color: theme.colors.white,
            fontFamily: theme.typography.h2.fontWeight,
            fontSize: theme.typography.h2.fontSize,
            marginTop: theme.spacing.lg,
            marginBottom: theme.spacing.sm,
          }]}>Camera Access Required</Text>
          <Text style={[styles.permissionText, {
            color: theme.colors.white,
            fontFamily: theme.typography.body.fontFamily,
            fontSize: theme.typography.body.fontSize,
            textAlign: 'center',
            marginBottom: theme.spacing.xl,
          }]}>
            We need camera access to analyze your designer bag and verify its authenticity.
          </Text>
          <TouchableOpacity
            style={[styles.permissionButton, {
              backgroundColor: theme.colors.primary,
              paddingVertical: theme.spacing.md,
              paddingHorizontal: theme.spacing.xl,
              borderRadius: theme.borderRadius.md,
            }]}
            onPress={requestPermission}
          >
            <Text style={[styles.permissionButtonText, {
              color: theme.colors.white,
              fontFamily: theme.typography.h3.fontWeight,
              fontSize: theme.typography.body.fontSize,
            }]}>Grant Permission</Text>
          </TouchableOpacity>
        </BlurView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.black }]}>
      {imageUri ? (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          <TouchableOpacity 
            style={[styles.retakeButton, { 
              top: insets.top + theme.spacing.lg,
              backgroundColor: theme.colors.black + '80',
              padding: theme.spacing.sm,
              borderRadius: theme.borderRadius.full,
              flexDirection: 'row',
              alignItems: 'center',
            }]} 
            onPress={() => onPhotoTaken('')}
          >
            <RotateCcw color={theme.colors.white} size={24} />
            <Text style={[styles.retakeText, {
              color: theme.colors.white,
              fontFamily: theme.typography.body.fontFamily,
              fontSize: theme.typography.body.fontSize,
              marginLeft: theme.spacing.xs,
            }]}>Retake</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <CameraView
          style={styles.camera}
          facing={facing}
          flash={flash}
          ref={cameraRef}
          onCameraReady={handleCameraReady}
        >
          <View style={[styles.overlayHeader, { paddingTop: insets.top }]}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={() => {
                setFacing(facing === 'back' ? 'front' : 'back');
              }}
            >
              <MaterialIcons name="flip-camera-ios" size={24} color={theme.colors.white} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.overlay}>
            <View style={styles.bagOverlay}>
              <View style={[styles.bagFrame, {
                borderColor: theme.colors.white + '99',
                borderWidth: 2,
                borderRadius: theme.borderRadius.md,
              }]} />
            </View>
            <Text style={[styles.instructionText, {
              color: theme.colors.white,
              fontFamily: theme.typography.body.fontFamily,
              fontSize: theme.typography.body.fontSize,
              marginTop: theme.spacing.lg,
              backgroundColor: theme.colors.black + '80',
              paddingHorizontal: theme.spacing.lg,
              paddingVertical: theme.spacing.sm,
              borderRadius: theme.borderRadius.full,
            }]}>
              Position your bag within the frame
            </Text>
          </View>
          
          <View style={[styles.overlayFooter, { padding: theme.spacing.lg }]}>
            <View style={styles.captureContainer}>
              <TouchableOpacity
                style={[styles.captureButton, {
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                  backgroundColor: theme.colors.white + '4D',
                }]}
                onPress={takePicture}
              >
                <View style={[styles.captureButtonInner, {
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: theme.colors.white,
                }]} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.galleryButton, {
                  backgroundColor: theme.colors.white + '4D',
                }]}
                onPress={pickImage}
              >
                <MaterialIcons name="photo-library" size={24} color={theme.colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: height * 0.6,
    width: '100%',
  },
  camera: {
    flex: 1,
  },
  overlayHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  flipButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bagOverlay: {
    width: '90%',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bagFrame: {
    width: '100%',
    height: '100%',
  },
  instructionText: {
    overflow: 'hidden',
  },
  overlayFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  captureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  captureButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreviewContainer: {
    flex: 1,
  },
  imagePreview: {
    flex: 1,
    width: '100%',
  },
  retakeButton: {
    position: 'absolute',
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  retakeText: {
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionTitle: {
  },
  permissionText: {
  },
  permissionButton: {
  },
  permissionButtonText: {
  },
  text: {
  },
});