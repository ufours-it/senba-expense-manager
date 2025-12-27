import { BaseToast, ErrorToast } from 'react-native-toast-message';

export const getToastConfig = (theme : any) => ({
  success: (props : any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: theme.mode === 'dark' ? '#10B981' : '#059669',
        backgroundColor: theme.mode === 'dark' ? '#064E3B' : '#ECFDF5',
        borderLeftWidth: 6,
        borderRadius: 12,
        height: 70,
      }}
      contentContainerStyle={{ 
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '600',
        color: theme.mode === 'dark' ? '#D1FAE5' : '#065F46',
      }}
      text2Style={{
        fontSize: 13,
        color: theme.mode === 'dark' ? '#A7F3D0' : '#047857',
      }}
    />
  ),
  error: (props : any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: theme.colors.danger,
        backgroundColor: theme.mode === 'dark' ? '#7F1D1D' : '#FEF2F2',
        borderLeftWidth: 6,
        borderRadius: 12,
        height: 70,
      }}
      contentContainerStyle={{ 
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '600',
        color: theme.mode === 'dark' ? '#FEE2E2' : '#991B1B',
      }}
      text2Style={{
        fontSize: 13,
        color: theme.mode === 'dark' ? '#FECACA' : '#DC2626',
      }}
    />
  ),
  info: (props : any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: theme.colors.primary,
        backgroundColor: theme.mode === 'dark' 
          ? 'rgba(99, 102, 241, 0.2)' 
          : '#EEF2FF',
        borderLeftWidth: 6,
        borderRadius: 12,
        height: 70,
      }}
      contentContainerStyle={{ 
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '600',
        color: theme.mode === 'dark' ? '#E0E7FF' : '#312E81',
      }}
      text2Style={{
        fontSize: 13,
        color: theme.mode === 'dark' ? '#C7D2FE' : '#4338CA',
      }}
    />
  ),
})