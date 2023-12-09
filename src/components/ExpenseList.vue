<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import ExpenseCard from "./ExpenseCard.vue";

const emit = defineEmits(["choosen-spent", "remove-spent"]);

const props = defineProps({
  expenses: Array,
});

const expenseList = ref();

// Calculate height of expenses list
const computedHeightList = () => {
  const { top } = expenseList.value.getBoundingClientRect();
  expenseList.value.style.setProperty("height", `calc(100vh - ${top}px)`);
};

onMounted(() => {
  console.log(expenseList.value)
  if (!expenseList.value) return;

  computedHeightList();
  window.addEventListener("resize", computedHeightList);
});

onUnmounted(() => window.removeEventListener("resize", computedHeightList));
</script>

<template>
  <ul ref="expenseList" class="space-y-4 overflow-y-auto">
    <ExpenseCard
      v-for="expense of expenses"
      :id="expense.id"
      :expense="expense"
      @choosen-spent="(id) => emit('choosen-spent', id)"
      @remove-spent="() => emit('remove-spent', expense.id)"
    />
  </ul>
</template>

<style lang="scss" scoped></style>
