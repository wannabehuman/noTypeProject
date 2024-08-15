
//카카오 맵 API
import { Dimensions} from 'react-native';
const config = {APIKEY_MAP : "90fda858df222be3db38be2784b08668"}
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
    <div id="map" style="width:${width-20}px;height:${height/2.8}px; border-radius:30px;"></div>
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

          const url = "https://apis-navi.kakaomobility.com/v1/waypoints/directions" ;

          const origin = arrayData[0].LATITUDE+','+arrayData[0].LONGTITUDE; 
          const destination = arrayData[arrayData.length - 1].LATITUDE+','+arrayData[arrayData.length - 1].LONGTITUDE;
          

          const headers = {
            Authorization: "KakaoAK ${config.APIKEY_MAP}",
            'Content-Type': 'application/json'
          };
          const queryParams = new URLSearchParams({
                origin: origin,
                destination: destination
          });

          const requestUrl = url+"?"+queryParams;

          try {
            const response = await fetch(requestUrl, {
              method: 'GET',
              headers: headers
            });

            if (!response.ok) {
              
            }

            const data = await response.json();
            const linePath = [];
            data.routes[0].sections[0].roads.forEach(router => {
              router.vertexes.forEach((vertex, index) => {
                             
                if (index % 2 === 0) {
                  linePath.push(new kakao.maps.LatLng(router.vertexes[index + 1], router.vertexes[index]));
                }
              });
            });
            var polyline = new kakao.maps.Polyline({
              path: linePath,
              strokeWeight: 5,
              strokeColor: '#000000',
              strokeOpacity: 0.7,
              strokeStyle: 'solid'
            }); 
            polyline.setMap(map);
            console.log(data)
          } catch (error) {
            console.error('Error:', error);
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
