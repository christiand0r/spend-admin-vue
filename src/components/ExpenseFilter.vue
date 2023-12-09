<script setup>
import { ref, onMounted } from "vue";
import { SPENDING_CATEGORIES as categories } from "../helpers/const";

const emit = defineEmits(["filter-category"]);
const select = ref(null);

const setFilterCategory = (e) => {
  const category = Object.fromEntries(new FormData(e.target.closest("form")));
  emit("filter-category", { category: category["category-filter"] });
};

const clearFilterCategory = () => {
  select.value.value = "";
  emit("filter-category", { category: "" });
};
</script>

<template>
  <div class="mb-4">
    <form class="flex items-stretch justify-between md:items-center">
      <select
        ref="select"
        id="category-filter"
        name="category-filter"
        class="flex-auto px-6 py-2 border rounded-tl-lg rounded-bl-lg outline-none w-full bg-gray-200 border-gray-200"
        @change="setFilterCategory"
      >
        <option value="" hidden selected>
          Elija una categoría para filtrar los gastos
        </option>
        <option
          v-for="category of categories"
          :key="category.id"
          :value="category.id"
        >
          {{ category.name }}
        </option>
      </select>

      <button
        type="button"
        @click="clearFilterCategory"
        class="px-6 py-2 rounded-tr-lg rounded-br-lg bg-blue-500 text-white"
      >
        Limpiar filtro
      </button>
    </form>
  </div>
</template>
