import { TextStyle } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'

type FontSize = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800

export const fontSize: Record<FontSize, number> = {
  100: RFValue(9),
  200: RFValue(10),
  300: RFValue(11),
  400: RFValue(14),
  500: RFValue(16),
  600: RFValue(24),
  700: RFValue(36), // TODO fix order
  800: RFValue(12) // TODO fix order
}

type LineHeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800

export const lineHeight: Record<LineHeight, number> = {
  100: 13.5,
  200: 15,
  300: 16.5,
  400: 21,
  500: 24,
  600: 34, // TODO design says 36 which makes a part of the line disappear
  700: 54,
  800: 18 // TODO fix the order
}

type FontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'

export const fontWeight: Record<FontWeight, FontWeight> = {
  normal: 'normal',
  bold: 'bold',
  100: '100',
  200: '200',
  300: '300',
  400: '400',
  500: '500',
  600: '600',
  700: '700',
  800: '800',
  900: '900'
}

type FontStyle =
  | 'h0SemiBold'
  | 'h1SemiBold'
  | 'h2Regular'
  | 'h2SemiBold'
  | 'h3SemiBold'
  | 'h4Regular'
  | 'h4SemiBold'
  | 'h5Regular'
  | 'h5SemiBold'
  | 'h6'
  | 'h7SemiBold'

export const fontStyle: Record<FontStyle, TextStyle> = {
  h0SemiBold: {
    fontFamily: 'Poppins-SemiBold', // TODO fix solution for just having Poppins as font family and using fontweight (which is now baked into the font family)
    fontSize: fontSize[700],
    fontWeight: fontWeight[600],
    lineHeight: lineHeight[700]
  },
  h1SemiBold: {
    fontFamily: 'Poppins-SemiBold', // TODO fix solution for just having Poppins as font family and using fontweight (which is now baked into the font family)
    fontSize: fontSize[600],
    fontWeight: fontWeight[600],
    lineHeight: lineHeight[600]
  },
  h2Regular: {
    fontFamily: 'Poppins-Regular', // TODO fix solution for just having Poppins as font family and using fontweight (which is now baked into the font family)
    fontSize: fontSize[500],
    fontWeight: fontWeight[400],
    lineHeight: lineHeight[500]
  },
  h2SemiBold: {
    fontFamily: 'Poppins-SemiBold', // TODO fix solution for just having Poppins as font family and using fontweight (which is now baked into the font family)
    fontSize: fontSize[500],
    fontWeight: fontWeight[600],
    lineHeight: lineHeight[500]
  },
  h3SemiBold: {
    fontFamily: 'Poppins-SemiBold', // TODO fix solution for just having Poppins as font family and using fontweight (which is now baked into the font family)
    fontSize: fontSize[400],
    fontWeight: fontWeight[600],
    lineHeight: lineHeight[400]
  },
  h4Regular: {
    fontFamily: 'Poppins-Regular', // TODO fix solution for just having Poppins as font family and using fontweight (which is now baked into the font family)
    fontSize: fontSize[300],
    fontWeight: fontWeight[400],
    lineHeight: lineHeight[300]
  },
  h4SemiBold: {
    fontFamily: 'Poppins-SemiBold', // TODO fix solution for just having Poppins as font family and using fontweight (which is now baked into the font family)
    fontSize: fontSize[300],
    fontWeight: fontWeight[400],
    lineHeight: lineHeight[300]
  },
  h5Regular: {
    fontFamily: 'Poppins-Regular', // TODO fix solution for just having Poppins as font family and using fontweight (which is now baked into the font family)
    fontSize: fontSize[200],
    fontWeight: fontWeight[400],
    lineHeight: lineHeight[200]
  },
  h5SemiBold: {
    fontFamily: 'Poppins-SemiBold', // TODO fix solution for just having Poppins as font family and using fontweight (which is now baked into the font family)
    fontSize: fontSize[200],
    fontWeight: fontWeight[600],
    lineHeight: lineHeight[200]
  },
  h6: {
    fontFamily: 'Poppins', // TODO fix solution for just having Poppins as font family and using fontweight (which is now baked into the font family)
    fontSize: fontSize[100],
    fontWeight: fontWeight[400],
    lineHeight: lineHeight[100]
  },
  h7SemiBold: {
    // TODO fix the order
    fontFamily: 'Poppins-SemiBold', // TODO fix solution for just having Poppins as font family and using fontweight (which is now baked into the font family)
    fontSize: fontSize[800],
    fontWeight: fontWeight[600],
    lineHeight: lineHeight[800]
  }
}
