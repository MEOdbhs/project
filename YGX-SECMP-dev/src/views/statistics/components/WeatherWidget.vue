<template>
  <div class="weather-widget">
    <div class="weather-info">
      <div class="weather-text">
        <span class="weather-desc">{{ weatherData.condition }}</span>
        <span class="weather-temp">{{ weatherData.temperature }}°C</span>
      </div>
    </div>
    <a-divider type="vertical" class="divider" />
    <div class="time-section">
      <div class="time">{{ currentTime }}</div>
    </div>
    <div class="date-info">
      <div class="weekday">{{ weekday }}</div>
      <div class="date">{{ formattedDate }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { realTimeWeather } from '../api';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

interface WeatherData {
  condition: string;
  temperature: string;
}

const weatherData = ref<WeatherData>({
  condition: '多云',
  temperature: '32.5'
});

const currentTime = ref<string>('');
const weekday = ref<string>('');
const formattedDate = ref<string>('');

let timer: NodeJS.Timeout | null = null;

const updateTime = () => {
  const now = dayjs();
  currentTime.value = now.format('HH:mm:ss');
  weekday.value = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][now.day()];
  formattedDate.value = now.format('YYYY/MM/DD');
};

const getWeatherData = async () => {
  const res = await realTimeWeather({});
  if(res){
    weatherData.value.condition = res.weather;
    weatherData.value.temperature = res.temperature;
  }
};

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
  getWeatherData();
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style lang="less" scoped>
.weather-widget {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  
  .weather-info {
    flex: 1;
    display: flex;
    align-items: flex-start;
    
    .weather-text {
      display: flex;
      flex-direction: column;
      gap: 4px;
      
      .weather-desc {
        font-size: 14px;
        color: #fff;
        line-height: 1.5;
      }
      
      .weather-temp {
        font-size: 14px;
        color: #fff;
        line-height: 1.5;
      }
    }
  }
  
  .divider {
    height: 60px;
    background-color: #adb7c6;
    margin: 0 24px;
  }
  
  .time-section {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    
    .time {
      font-size: 24px;
      font-weight: 500;
      color: #fff;
      font-family: 'Courier New', monospace;
      letter-spacing: 1px;
    }
  }
  
  .date-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    margin-left: 12px;
    
    .weekday {
      font-size: 20px;
      color: #fff;
      line-height: 1.5;
    }
    
    .date {
      font-size: 14px;
      color: #fff;
      line-height: 1.5;
    }
  }
}
</style>

