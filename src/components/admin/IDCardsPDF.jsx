import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register Arabic font for correct RTL rendering
Font.register({ family: 'NotoSansArabic', src: '/NotoSansArabic-Regular.ttf' });


const styles = StyleSheet.create({
  page: {
    padding: 10,
    backgroundColor: '#ffffff',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: '32%',
    marginBottom: 8,
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 170,
    objectFit: 'contain',
  },
  textOverlay: {
    position: 'absolute',
    bottom: 20,
    right: 15,
    padding: 8,
    borderRadius: 4,
    alignItems: 'flex-end',
    direction: 'rtl',
  },
  arabicLabel: {
    fontFamily: 'NotoSansArabic',
    fontSize: 13,
    color: '#2194D1',
    textAlign: 'right',
    direction: 'rtl',
    lineHeight: 1.4,
    marginBottom: 2,
    fontWeight: 'bold',
  },
  arabicText: {
    fontFamily: 'NotoSansArabic',
    fontSize: 13,
    color: '#000000',
    textAlign: 'right',
    direction: 'rtl',
    lineHeight: 1.4,
    marginBottom: 2,
  },
});

const IDCardsPDF = ({ names, club, church, imageUrl }) => {
  console.log('IDCardsPDF component rendering with names:', names.length);
  // Split names into chunks of 9 for each page
  const chunks = [];
  for (let i = 0; i < names.length; i += 9) {
    chunks.push(names.slice(i, i + 9));
  }

  return (
    <Document>
      {chunks.map((pageNames, pageIndex) => (
        <Page key={pageIndex} size="A4" orientation="landscape" style={styles.page}>
          <View style={styles.cardGrid}>
            {pageNames.map((name, cardIndex) => (
              <View key={cardIndex} style={styles.cardContainer}>
                <Image src={imageUrl} style={styles.cardImage} />
                <View style={styles.textOverlay}>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Text style={styles.arabicText}>{name}</Text>
                    <Text style={styles.arabicLabel}>الاسم: </Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Text style={styles.arabicText}>{club}</Text>
                    <Text style={styles.arabicLabel}>النادي: </Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Text style={styles.arabicText}>{church}</Text>
                    <Text style={styles.arabicLabel}>الكنيسة: </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default IDCardsPDF;