<template>
  <div class="px-2">
    <full-calendar :options="config" v-if="isAuthenticated">
      <template #allDaySlot>Весь день</template>
    </full-calendar>
    <div class="p-5" v-else>
      Для отображения календаря
      <a href="#" @click.prevent="showAuthModal()">авторизуйтесь</a>
    </div>
    <event-modal />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import EventBus from "../event-bus";
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventModal from "../components/EventModal.vue";
import eventsApi from "../api/events";

export default {
  components: {
    FullCalendar,
    EventModal,
  },
  data: () => ({
    events: null,
  }),
  computed: {
    ...mapGetters(["isAuthenticated"]),
    config() {
      return {
        ...this.configOptions,
        ...this.eventHandlers,
      };
    },
    configOptions() {
      return {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: "timeGridWeek",
        locale: "ru",
        editable: true,
        selectable: true,
        selectMirror: true,
        events: this.events,
        height: window.innerHeight,
        headerToolbar: {
          left: "timeGridWeek dayGridMonth",
          center: "title",
          right: "prev,next today authBtn",
        },
        buttonText: {
          today: "Сегодня",
          month: "Месяц",
          week: "Неделя",
        },
        allDayText: "Весь день",
        customButtons: {
          authBtn: {
            text: this.isAuthenticated ? "Выход" : "Вход/Регистрация",
            click: () => {
              console.log(this.isAuthenticated);
              if (this.isAuthenticated) this.logout();
              else this.showAuthModal();
            },
          },
        },
      };
    },
    eventHandlers() {
      return {
        dateClick: this.onDateClick,
        eventClick: this.onEventClick,
        eventDrop: this.onEventDrop,
        eventResize: this.onEventDrop,
        select: this.onDateSelect,
      };
    },
  },

  methods: {
    ...mapMutations(["showAuthModal", "showEventModal", "setCurrentEvent"]),
    ...mapActions(["logout"]),
    async loadEvents() {
      const events = await eventsApi.list();
      this.events = events.map((event) => {
        return {
          start: new Date(event.event.start_at),
          end: event.event.end_at ? new Date(event.event.end_at) : null,
          allDay: event.event.all_day,
          id: event.id,
          title: event.event.title,
          note: event.note,
        };
      });
    },
    onDateClick(payload) {
      const { start, end, date, allDay } = payload;
      this.setCurrentEvent({
        start,
        end,
        date,
        allDay,
      });
      this.showEventModal();
    },
    onDateSelect(payload) {
      return this.onDateClick(payload);
    },
    onEventClick({ event }) {
      this.setCurrentEvent(event);
      this.showEventModal();
    },
    onEventDrop({ event }) {
      return eventsApi.update(event.id, { event: { start_at: event.start } });
    },
  },
  mounted() {
    this.loadEvents();
    EventBus.$on("newEvent", this.loadEvents);
  },
};
</script>