import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {WebView} from 'react-native-webview';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Colors from './Colors';
import Assets from './AssetRegistry';
import {useTabBarInset} from './MainTabs';
import {LOCATIONS} from './Data';

const {width: screenW, height: screenH} = Dimensions.get('screen');

const CENTER_LAT = 45.4408;
const CENTER_LNG = 12.3155;

const PIN_URI = Image.resolveAssetSource(Assets.ICONS.icon_pin).uri;

function buildMapHtml() {
  const markers = LOCATIONS.map(l => ({id: l.id, lat: l.lat, lng: l.lng}));
  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    html,body,#map{width:100%;height:100%}
    .leaflet-control-attribution{display:none!important}
    .leaflet-control-zoom{margin-bottom:120px!important;margin-right:12px!important}
    .leaflet-control-zoom a{background:#112918!important;color:#e8d5a3!important;border-color:#2a5c3a!important;font-size:16px!important}

    #loader-overlay {
      position:fixed;top:0;left:0;right:0;bottom:0;
      background:#030d06;
      display:flex;align-items:center;justify-content:center;
      z-index:9999;
      transition:opacity 0.4s ease;
    }
    #loader-overlay.hidden{opacity:0;pointer-events:none;}

    .momentum{
      --uib-size:40px;--uib-speed:1s;--uib-color:rgb(221,255,242);
      position:relative;display:flex;align-items:center;justify-content:center;
      height:var(--uib-size);width:var(--uib-size);
      animation:rotate01561 var(--uib-speed) linear infinite;
    }
    .momentum::before,.momentum::after{
      content:'';height:25%;width:25%;border-radius:50%;
      background-color:var(--uib-color);
    }
    .momentum::before{
      margin-right:10%;
      animation:wobble290123 calc(var(--uib-speed)*1.25) ease-in-out infinite;
    }
    .momentum::after{
      animation:wobble9123 calc(var(--uib-speed)*1.25) ease-in-out infinite;
    }
    @keyframes wobble9123{
      0%,100%{transform:translateX(0);}
      50%{transform:translateX(calc(var(--uib-size)*0.2)) scale(1.1);}
    }
    @keyframes wobble290123{
      0%,100%{transform:translateX(0);}
      50%{transform:translateX(calc(var(--uib-size)*-0.2)) scale(1.1);}
    }
    @keyframes rotate01561{
      0%{transform:rotate(0deg);}
      100%{transform:rotate(360deg);}
    }
  </style>
</head>
<body>
<div id="loader-overlay"><div class="momentum"></div></div>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  var map = L.map('map',{zoomControl:false}).setView([${CENTER_LAT},${CENTER_LNG}],13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);
  L.control.zoom({position:'bottomright'}).addTo(map);
  var icon = L.icon({iconUrl:'${PIN_URI}',iconSize:[32,40],iconAnchor:[16,40]});
  var locs = ${JSON.stringify(markers)};
  locs.forEach(function(loc){
    var m = L.marker([loc.lat,loc.lng],{icon:icon}).addTo(map);
    m.on('click',function(){
      map.setView([loc.lat,loc.lng],15,{animate:true});
      window.ReactNativeWebView.postMessage(JSON.stringify({type:'tap',id:loc.id}));
    });
  });
  map.whenReady(function(){
    var overlay = document.getElementById('loader-overlay');
    overlay.classList.add('hidden');
    setTimeout(function(){overlay.style.display='none';},400);
  });
</script>
</body>
</html>`;
}

const MAP_HTML = buildMapHtml();

export default function MapScreen({navigation}) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState(null);
  const bottomPadding = useTabBarInset();
  const cardAnim = useRef(new Animated.Value(0)).current;

  const mapStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenW,
    height: screenH,
  };

  const openCard = loc => {
    setSelected(loc);
    Animated.spring(cardAnim, {
      toValue: 1,
      useNativeDriver: true,
      bounciness: 6,
    }).start();
  };

  const closeCard = () => {
    Animated.timing(cardAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setSelected(null));
  };

  const onMapMessage = event => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'tap') {
        const loc = LOCATIONS.find(l => l.id === data.id);
        if (loc) openCard(loc);
      }
    } catch {}
  };

  const cardTranslateY = cardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  return (
    <View style={[StyleSheet.absoluteFillObject, styles.root]}>
      <WebView
        style={[StyleSheet.absoluteFillObject, mapStyle]}
        source={{html: MAP_HTML}}
        onMessage={onMapMessage}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always"
        allowFileAccess
      />

      {/* Title pill */}
      <View style={[styles.titleWrap, {top: (insets.top || 0) + 12}]}>
        <Text style={styles.title}>Map</Text>
      </View>

      {/* Popup card */}
      {selected && (
        <Animated.View
          style={[
            styles.cardOuter,
            {bottom: bottomPadding + 80, transform: [{translateY: cardTranslateY}]},
          ]}>
          {/* Gradient border wrapper */}
          <LinearGradient
            colors={['rgba(45,122,74,0.9)', 'rgba(45,122,74,0.05)']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={styles.cardBorder}>
            <LinearGradient
              colors={['rgba(8,40,18,0)', 'rgba(8,40,18,0.95)']}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              style={styles.card}>
              {/* Close button */}
              <TouchableOpacity style={styles.closeBtn} onPress={closeCard} activeOpacity={0.8}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>

              {/* Image with text overlay */}
              <View style={styles.imgWrap}>
                <Image
                  source={Assets.LOC[selected.image]}
                  style={styles.img}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['rgba(0,0,0,0.85)', 'rgba(0,0,0,0)']}
                  start={{x: 0, y: 1}}
                  end={{x: 0, y: 0}}
                  style={styles.imgGradient}
                />
                <View style={styles.nameOverlay}>
                  <Text style={styles.name} numberOfLines={1}>{selected.name}</Text>
                </View>
              </View>

              {/* Look details button */}
              <View style={styles.cardBody}>
                <TouchableOpacity
                  style={styles.detailBtnWrap}
                  onPress={() => {
                    closeCard();
                    navigation.navigate('LocationDetail', {location: selected});
                  }}
                  activeOpacity={0.85}>
                  <LinearGradient
                    colors={['#F6D28F', '#E5B96A']}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                    style={styles.detailBtn}>
                    <View style={styles.detailBtnInner}>
                      <Text style={styles.detailBtnText}>Look details</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </LinearGradient>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {backgroundColor: 'transparent', overflow: 'visible'},
  titleWrap: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  title: {color: Colors.GREEN_LIGHT, fontSize: 16, fontWeight: '700'},
  cardOuter: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 10,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 12,
  },
  cardBorder: {
    borderRadius: 24,
    padding: 1.5,
  },
  card: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 20,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {color: Colors.TEXT, fontSize: 15, fontWeight: '700'},
  imgWrap: {
    margin: 10,
    borderRadius: 16,
    overflow: 'hidden',
  },
  img: {width: '100%', height: 220},
  imgGradient: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: '45%',
  },
  nameOverlay: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    paddingVertical: 18,
    paddingHorizontal: 16,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  name: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  cardBody: {padding: 14},
  detailBtnWrap: {width: '100%'},
  detailBtn: {
    borderRadius: 999,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailBtnInner: {marginVertical: 13, marginHorizontal: 32},
  detailBtnText: {color: Colors.BG_DARK, fontWeight: '700', fontSize: 15},
});
