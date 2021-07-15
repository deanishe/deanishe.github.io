(function(){(function($){})(jQuery);this.Weather=class Weather{constructor(){this.beaufortWindSpeedMapping={0:1.1,1:5.5,2:11.9,3:19.7,4:28.7,5:38.8,6:49.9,7:61.8,8:74.6,9:88.1,10:102.4,11:117.4};}
run(){console.log('[weather] running ...');$('.percent.value').each((i,e)=>{var p,pc;p=$(e).data('percent');pc=(p*100).toFixed(0)+'%';return $(e).html(pc);});$('.forecast .wind').each((i,elem)=>{var bearing,wc;elem=$(elem);bearing=elem.data('bearing');wc=this.getWindDirectionIconClass(bearing);console.log('[wind] bearing='+bearing+', wc='+wc);elem.find('.bearing').html('');return elem.find('i.icon').addClass(wc);});$('.forecast .summary').each(function(i,div){var icon;div=$(div);icon=div.data('icon');return div.find('i.icon').addClass('wi wi-forecast-io-'+icon);});$('section.later').each((i,s)=>{s=$(s);return s.find('.forecast').each((i,f)=>{return $(f).find('.summary').each((i,div)=>{var d;div=$(div);d=this.timestampToDate(div.data('time'));return div.find('time').each((i,t)=>{t=$(t);t.attr('datetime',d);return t.html(this.formatDate(d));});});});});$('.forecast .temp').each(function(i,div){var t;div=$(div);t=div.data('temp');i=t.toFixed(0);if(i==='-0'){i=0;}
return div.find('.value').html(i);});$('.forecast .precipitation .summary').each(function(i,elem){elem=$(elem);if(elem.data('probability')===0){return elem.html('dry');}});$('.forecast .wind .speed').each((i,div)=>{div=$(div);return div.html(this.metresPerSecondToKph(div.data('speed'))+' kph');});return $('.forecast').each((i,section)=>{section=$(section);section.find('tr.precipitation').each((i,tr)=>{var intensity,level,probability,type;tr=$(tr);type=tr.data('type');intensity=tr.data('intensity');probability=tr.data('probability');level=this.getPrecipitationWarnLevel(probability,intensity);console.log(`[precipitation] type=${type}, intensity=${intensity}, probability=${probability}, level=${level}`);return tr.find('i.icon').each(function(i,icon){if(level===0){}else{return $(icon).addClass('wi wi-rain warn'+level);}});});return section.find('tr.wind').each((i,tr)=>{var level,speed;tr=$(tr);speed=this.metresPerSecondToKph(tr.data('speed'));level=this.getWindWarnLevel(speed);console.log(`[wind] speed=${speed}, level=${level}`);return tr.find('i.icon').each(function(i,icon){if(level>0){return $(icon).addClass('warn'+level);}});});});}
sortNumber(a,b){return a-b;}
sortEvents(e1,e2){return e1.time-e2.time;}
getWeatherIconClass(data){if(!data){return this.weatherIconClassMapping['unknown'];}
if(data.icon.indexOf('cloudy')>-1){if(data.cloudCover<0.25){return this.weatherIconClassMapping["clear-day"];}else if(data.cloudCover<0.5){return this.weatherIconClassMapping["mostly-clear-day"];}else if(data.cloudCover<0.75){return this.weatherIconClassMapping["partly-cloudy-day"];}else{return this.weatherIconClassMapping["cloudy"];}}else{return this.weatherIconClassMapping[data.icon];}}
getMoonIconClass(data){var i,j,key,len,phase,phases,thisPhase;phases=(function(){var results;results=[];for(key in this.moonIconClassMapping){results.push(key);}
return results;}).call(this);phases.sort();thisPhase=null;for(i=j=0,len=phases.length;j<len;i=++j){phase=phases[i];if(data.moonPhase===phase){thisPhase=phase;break;}
if(data.moonPhase<phase){thisPhase=phase;break;}}
if(thisPhase){console.log('Moon phase : '+thisPhase);return this.moonIconClassMapping[thisPhase];}
return '';}
getWindDirectionIconClass(bearing){return `wi wi-wind from-${bearing}-deg`;}
getWindForce(windSpeed){var j,key,len,limit,numbers,scaleNo,windForce;numbers=(function(){var results;results=[];for(key in this.beaufortWindSpeedMapping){results.push(key);}
return results;}).call(this);windForce=null;for(j=0,len=numbers.length;j<len;j++){scaleNo=numbers[j];limit=this.beaufortWindSpeedMapping[scaleNo];if(windSpeed<=limit){windForce=scaleNo;break;}}
if(windForce===null){windForce=12;}
return windForce;}
getWindForceIconClass(data){var windForce;windForce=this.getWindForce(data);return `wi-beaufort-${windForce}`;}
getRainProbability(data){if(data.precipProbability===0){return 'dry';}
return(data.precipProbability*100).toFixed(0)+'%';}
getRainIntensity(data){var intensity;if(data.precipProbability===0){return '';}
intensity='v. light';if(data.precipIntensity>0.017){intensity='light';}
if(data.precipIntensity>0.1){intensity='moderate';}
if(data.precipIntensity>0.4){intensity='heavy';}
return intensity;}
getPrecipitationWarnLevel(probability,intensity){var i,level,p;if(probability===0){return 0;}
level=0;p=probability;i=intensity;if(p>=0.9){level=5;}else if(p>=0.7){level=4;}else if(p>=0.5){level=3;}else if(p>=0.3){level=2;}else if(p>=0.1){level=1;}
if(i<0.017){level-=1;}else if(i>0.4){level+=2;}else if(i>0.2){level+=1;}
if(level>5){level=5;}
return level;}
getWindWarnLevel(windSpeed){var windForce;windForce=this.getWindForce(windSpeed);if(windForce>5){return 5;}
if(windForce>4){return 4;}
if(windForce>2){return 3;}
if(windForce>1){return 2;}
if(windForce>0){return 1;}
return 0;}
getWarnings(data){var i,level,p,w,warnings,windForce;warnings=[];level=0;p=data.precipProbability;i=data.precipIntensity;if(p>=0.9){level=5;}else if(p>=0.7){level=4;}else if(p>=0.5){level=3;}else if(p>=0.3){level=2;}else if(p>=0.1){level=1;}
if(i<0.017){level-=1;}else if(i>0.4){level+=2;}else if(i>0.2){level+=1;}
if(level>5){level=5;}
if(level>0){w={type:'rain',level:level};warnings.push(w);}
windForce=this.getWindForce(data);if(windForce>2){w={type:'wind',level:windForce};warnings.push(w);}
return warnings;}
getRainDangerLevel(data){var j,len,ref,w;ref=this.getWarnings(data);for(j=0,len=ref.length;j<len;j++){w=ref[j];if(w.type==='rain'){return w.level;}}
return 0;}
getWindDangerLevel(data){var j,len,ref,w;ref=this.getWarnings(data);for(j=0,len=ref.length;j<len;j++){w=ref[j];if(w.type==='wind'){return w.level;}}
return 0;}
getWind(data){var windSpeed;windSpeed=data.windSpeed*3.6;return windSpeed.toFixed(0)+' kph';}
timestampToDate(utcTime){var date;date=new Date(0);date.setUTCSeconds(utcTime);return date;}
formatDate(date){return date.getHours()+':'+'0'+date.getMinutes();}
metresPerSecondToKph(n){return(n*3.6).toFixed(0);}
renderIcon(cssClass){return `<i class="wi ${cssClass}"></i>`;}
renderWind(data){return `<div class="windbox">\n  <div class="wind-direction">${this.renderIcon(this.getWindDirectionIconClass(data))}</div>\n  <div class="wind-speed">${this.getWind(data)}</div>\n</div>`;}
renderWindDaily(data){return `<span class="wind-direction">${this.renderIcon(this.getWindDirectionIconClass(data))}</span>\n<span class="wind-speed">${this.getWind(data)}</span>`;}
renderWarnings(data){var j,len,output,w,warnings;warnings=this.getWarnings(data);output=[];for(j=0,len=warnings.length;j<len;j++){w=warnings[j];if(w.type==='rain'){output.push(`<li class="warning rain-${w.level}">${this.renderIcon('wi-rain')}</li>`);}else if(w.type==='wind'){output.push(`<li class="warning">${this.renderIcon(this.getWindForceIconClass(data))}</li>`);}}
if(output.length){return `<ul class="warnings">\n  ${output.join('')}\n</ul>`;}else{return "";}}};console.log('[weather] loaded');}).call(this);