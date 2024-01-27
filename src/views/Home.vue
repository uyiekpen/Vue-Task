<template>
  <div
    :class="{ 'dark': isDarkMode }"
    class="bg-[#F4F6F8] dark:bg-[#121721] absolute z-1 w-full "
  >
    <div class="-mt-4  md:px-28 px-2  ">
      <div
        class="w-full bg-white h-[60px] px-2  rounded-md shadow-md dark:bg-[#19202D]"
      >
        <div class=" md:block hidden">
          <div class=" flex justify-between items-center p-2">
            <div class="flex">
              <Search />
              <input
                placeholder="Filter by title, companies,expertise…"
                class="w-[300px] outline-none px-2 dark:bg-[#19202D]"
              />
            </div>
            <div
              class="border-l border-gray-300 h-[19px] dark:bg-[#5964E0]"
            ></div>

            <div class="flex ">
              <Location />
              <input
                placeholder="Filter by location…"
                class="w-[300px] outline-none px-2  dark:bg-[#19202D]"
              />
            </div>

            <div class="border-l border-gray-300 h-[19px]"></div>

            <div>
              <label class="mx-2 font-semibold">
                <input type="checkbox" class="mr-2 " />
                Full-time only
              </label>
            </div>

            <div>
              <button class="bg-[#5964E0] text-white px-4 py-2 rounded-md">
                Search
              </button>
            </div>
          </div>
        </div>
        <div class="md:hidden block">
          <div class="flex py-4">
            <div class="">
              <input placeholder="Filter location" class="outline-none" />
            </div>
            <button
              class="bg-[#5964E0] text-white px-2 py-2 rounded-md"
            ></button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap md:px-28 px-2  justify-center mt-4">
      <div
        class="h-[228px] md:w-[330px] w-[280px] m-4 leading-4 rounded-lg shadow-lg p-6  bg-white cursor-pointer dark:bg-[#19202D] "
        v-for="job in Job"
        :key="job.id"
        @click="() => navigatetoJob(job.id)"
      >
        <div
          class=" -mt-10 mb-4 text-lg font-extrabold text-[#6771E4] bg-white h-[50px] w-[50px] shadow-md rounded-lg flex justify-center items-center dark:bg-[#4722C6] "
        >
          <div class="">
            {{ job.company.name.slice(0, 2) }}
          </div>
        </div>
        <div class="flex text-[12px] font-normal text-[#6E8098] leading-normal">
          <p>{{ formatDate(job.publication_date) }} day ago</p>
          .
          <p>{{ job.levels.map(level => level.name).join(", ") }}</p>
        </div>
        <div
          class="flex text-[18px] font-[700] text-[#19202D] leading-normal mt-1 dark:text-[#6E8098]"
        >
          <p>{{job.name}}</p>
        </div>

        <div
          class="flex text-[16px] font-[400] text-[#6E8098] leading-normal mt-1 "
        >
          <p>{{job.company.name}}</p>
        </div>
        <div>
          <p
            class="flex text-[12px] font-[700] text-[#5964E0] leading-normal mt-2  "
          >
            {{ job.locations.map(location => location.name).join(", ") }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Search from "../components/icons/Search.vue";
import Location from "../components/icons/Location.vue";

export default {
  components: {
    Search,
    Location,
  },
  props: {
    isDarkMode: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const Job = ref([]);
    const visibleJobs = ref([]);
    const isLoading = ref(true);
    const router = useRouter();
    const searchData = ref("")

    const navigatetoJob = (jobId) => {
      router.push(`/details/${jobId}`);
    };

    const formatDate = (timestamp) => {
      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      const currentTimestamp = Date.now();

      const jobTimestamp = new Date(timestamp).getTime();

      const daysDifference = Math.floor((currentTimestamp - jobTimestamp) / millisecondsPerDay);
      return daysDifference;
    };

    const showMore = () => {
      const batchSize = 12;

      if (Job.value) {
        visibleJobs.value = [
          ...visibleJobs.value,
          ...Job.value.slice(visibleJobs.value.length, visibleJobs.value.length + batchSize),
        ];
      }
    };

    const SearchData = () => {
      const query = searchData.value.toLowerCase
      Job.value =  Job.value.filter(job => {
        return (
          job.name.toLowerCase().includes(query) ||
          job.company.name.toLowerCase().includes(query) ||
          job.expertise.toLowerCase().includes(query)
        )
      })
    }

    const fetchData = async () => {
      try {
        const response = await axios.get("https://www.themuse.com/api/public/jobs?category=Software%20Engineer&level=Entry%20Level&level=Mid%20Level&level=Senior%20Level&level=Internship&page=3&descending=true");
        Job.value = response.data.results;
        isLoading.value = false;
        console.log('API Response:', response.data.results);
      } catch (error) {
        console.error('Error fetching data:', error.message);
        isLoading.value = false;
      }
    };

    onMounted(fetchData);

    return {
      Job,
      visibleJobs,
      isLoading,
      navigatetoJob,
      formatDate,
      showMore,
      searchData,
      Search
    };
  },
};
</script>
