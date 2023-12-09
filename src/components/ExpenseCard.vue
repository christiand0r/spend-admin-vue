<script setup>
import { computed, ref } from "vue";
import {
  getImageUrl,
  parseNumberToCurrency,
  parseStampToLocaleDate,
} from "../helpers";
import { SPENDING_CATEGORIES as categories } from "../helpers/const";

const emit = defineEmits(["choosen-spent", "remove-spent"]);

const { expense } = defineProps({
  expense: Object,
});

const confirmDelete = ref(false);

const expenseCategory = computed(() => {
  const category = categories.find(
    (category) => category.id === expense.category
  );

  return category ? category.name.toLocaleLowerCase() : "Sin categoría";
});
</script>

<template>
  <li
    class="grid items-center px-4 py-6 rounded-lg shadow-md grid-cols-1 w-full bg-white md:grid-cols-3"
  >
    <header
      class="flex justify-between items-center gap-4 mb-4 col-span-1 md:col-span-3"
    >
      <div class="flex gap-2">
        <time
          :datetime="new Date(expense.timestamp).toISOString()"
          class="block text-xs text-center text-gray-400 md:text-start"
        >
          {{ parseStampToLocaleDate(expense.timestamp) }}
        </time>

        <span
          v-if="expense.modified"
          :title="parseStampToLocaleDate(expense.modified)"
          class="block text-xs text-center text-gray-400 md:text-start"
          >(Editado)</span
        >
      </div>

      <div class="flex items-center gap-1">
        <button
          @click="() => (confirmDelete = !confirmDelete)"
          class="text-xl text-red-800"
        >
          <i class="bi bi-x-circle"></i>
        </button>
        <button
          @click="() => emit('remove-spent', expense.id)"
          class="text-[10px] px-2 py-1 rounded-full whitespace-nowrap overflow-hidden bg-red-800 text-white"
          :class="[confirmDelete ? 'block' : 'pointer-events-none hidden']"
        >
          Confirmar eliminación
        </button>
      </div>
    </header>
    <div
      class="flex flex-col items-center gap-2 col-span-1 md:flex-row md:gap-4 md:col-span-2"
    >
      <img
        :src="getImageUrl(`${expense.category}_icon`)"
        :alt="`Logo de categoría ${expenseCategory}`"
        class="rounded-full overflow-hidden h-20 w-20 md:h-28 md:w-28"
      />
      <div class="flex-auto text-center md:text-start">
        <p
          @click="() => emit('choosen-spent', expense.id)"
          title="Presiona para editar el gasto"
          class="font-semibold text-xl cursor-pointer text-gray-600 md:text-2xl"
        >
          {{ expense.concept }}
        </p>
        <p class="font-semibold text-xs uppercase text-gray-400 md:text-base">
          {{ expenseCategory }}
        </p>
      </div>
    </div>
    <div class="mt-4 col-span-1 md:mt-0">
      <p class="font-bold text-3xl text-center text-blue-900 md:text-4xl">
        {{ parseNumberToCurrency(expense.amount) }}
      </p>
    </div>
  </li>
</template>
