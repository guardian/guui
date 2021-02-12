import { getCLS, getFID, getLCP, getFCP, getTTFB } from 'web-vitals';


const jsonData = {
    'page_view_id': '',
    'fid': 0,
    'cls': 0,
    'lcp': 0,
    'fcp': 0,
    'ttfb': 0,
}

export const coreVitals = (): void =>
{
    type coreVitalsArgs = {
        name: string;
        value: number;
    };


const getValue = ({ name, value }: coreVitalsArgs): void => {
    switch(name){
        case('FCP'):
            console.log(`FCP: ${  value}`);
            jsonData.fcp = value;
            break;
        case('CLS'):
            console.log(`CLS: ${value}`)
            jsonData.cls = value;
            break;
        case('LCP'):
            console.log(`LCP: ${value}`)
            jsonData.lcp = value;
            break;
        case('FID'):
            console.log(`FID: ${value}`)
            jsonData.fid = value;
            break;
        case('TTFB'):
            console.log(`TTFB: ${value}`)
            jsonData.ttfb = value;
            break;
    }
	if(jsonData.cls !== null)
	{
		/*fetch('https://performance-events.guardianapis.com/core-web-vitals', {
  		method: 'POST',
  		headers: {
    		'Content-Type': 'application/json',
  		},
  		body: JSON.stringify(jsonData),
		})
	.then(response => response.json())
	.then(data => {
  	console.log('Success:', data);
	})
	.catch((error) => {
  	console.error('Error:', error);
	});*/


	let headers = {
    type: 'application/json'
  	};
  let blob = new Blob([JSON.stringify(jsonData)], headers);
  navigator.sendBeacon('https://performance-events.guardianapis.com/core-web-vitals', blob);


	}

}

if(window.guardian && window.guardian.ophan)
        {
            jsonData.page_view_id = window.guardian.ophan.pageViewId;
        }
        getFID(getValue);
        getLCP(getValue);
        getFCP(getValue);
        getTTFB(getValue);

        // At the moment a final CLS score is only reported on a 'visiblitychange' event (which is far from ideal)
        // https://github.com/WICG/layout-instability#computing-dcls-with-the-api
        // We need to find a more reliable way to record CLS without switching tabs.
        // I looked at using the 'unload' event but it only returns the cls delta for that event, which is incorrect.
        getCLS(getValue);


    document.addEventListener("DOMContentLoaded", function() {


    });

};






