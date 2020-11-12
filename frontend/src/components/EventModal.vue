<template>
  <b-modal v-model="showingEventModal" :title="modalTitle" hide-footer>
    <b-form @submit.stop.prevent="handleSubmit()">
      <b-form-group label="Название">
        <b-form-input v-model="title" required />
      </b-form-group>
      <b-form-group>
        <b-form-checkbox
          id="checkbox-allDay"
          v-model="allDay"
          :value="true"
          :unchecked-value="false"
        >
          Мероприятие проходит весь день
        </b-form-checkbox>
      </b-form-group>
      <b-form-group label="Заметка">
        <b-textarea
          id="event-note"
          v-model="note"
          :value="true"
          :unchecked-value="false"
        />
      </b-form-group>
      <b-btn
        variant="outline-danger"
        class="mr-3"
        v-if="currentEvent ? currentEvent.id : false"
        @click="del(currentEvent.id)"
        >Удалить</b-btn
      >
      <b-btn variant="outline-primary" type="submit">Сохранить</b-btn>
    </b-form>
  </b-modal>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import EventBus from "../event-bus";
import eventApi from "../api/events";

export default {
  data: () => ({
    title: null,
    allDay: false,
    note: null,
  }),
  computed: {
    ...mapState(["currentEvent"]),
    showingEventModal: {
      get() {
        return this.$store.state.showingEventModal;
      },
      set(value) {
        (value ? this.showEventModal : this.hideEventModal)();
      },
    },
    modalTitle() {
      if (this.currentEvent?.id) return "Редактирование мероприятия";
      else return "Создание мероприятия";
    },
  },
  watch: {
    currentEvent() {
      this.title = this.currentEvent.title;
      this.allDay = this.currentEvent.allDay;
      this.note = this.currentEvent.extendedProps.note;
    },
  },
  methods: {
    ...mapMutations(["hideEventModal", "showEventModal"]),
    async handleSubmit() {
      const data = {
        event: {
          title: this.title,
          all_day: this.allDay,
        },
        note: this.note,
      };
      if (!this.currentEvent.allDay) {
        data.event.start_at = this.currentEvent.start;
        data.event.end_at = this.currentEvent.end;
      } else {
        data.event.start_at = this.currentEvent.date || this.currentEvent.start;
        data.event.all_day = true;
      }
      if (!this.currentEvent.id) await eventApi.create(data);
      else await eventApi.update(this.currentEvent.id, data);
      EventBus.$emit("newEvent");
      this.hideEventModal();
    },
    async del(idx) {
      await eventApi.del(idx);
      EventBus.$emit("newEvent");
      this.hideEventModal();
    },
  },
};
</script>