//카카오 맵 API
import { Dimensions} from 'react-native';
const config = {APIKEY_MAP : ""}
const { width, height } = Dimensions.get('window');

const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>카카오 맵</title>
    <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${config.APIKEY_MAP}"></script>
</head>
<body>
    <div id="map" style="width:${width-20}px;height:${height-445}px; border-radius:30px;"></div>
    <script type="text/javascript">
        let map = '';
        let marker = '';

        function initMap(lat, lng) {
            var container = document.getElementById('map');
            var options = { 
                center: new kakao.maps.LatLng(lat, lng),
                level: 3
            };
            
            map = new kakao.maps.Map(container, options);

            marker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(lat, lng)
            });
            marker.setMap(map);

            
        }
        async function setMarker(arrayData){

          const tempData = arrayData.map(v => {
              return {
                title:  v.STOP_BY, 
                latlng: new kakao.maps.LatLng(v.LATITUDE, v.LONGTITUDE)
              }
            })
          
          for(let i = 0; i < tempData.length; i++) {

            marker = new kakao.maps.Marker({
                map: map, 
                position: tempData[i].latlng,
                title : tempData[i].title,
            });
          }

        

        }
        function updatePosition(lat, lng) {
        
          
          var moveLatLon = new kakao.maps.LatLng(lat, lng);
          map.setCenter(moveLatLon);
          marker.setPosition(moveLatLon);
            
        }



        window.onload = function() {
            
            // initMap(33.450701, 126.570667); // 초기 위치 설정
        }
    </script>
</body>
</html>
`;





export { config, html };
