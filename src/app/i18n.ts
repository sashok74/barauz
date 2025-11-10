import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      menu: {
        salesOrders: 'Sales Orders',
        production: 'Production',
        settings: 'Settings',
      },
      actions: {
        create: 'Create',
        edit: 'Edit',
        delete: 'Delete',
        save: 'Save',
        cancel: 'Cancel',
        export: 'Export',
        approve: 'Approve',
        search: 'Search',
      },
      messages: {
        confirmDelete: 'Are you sure you want to delete?',
        saveSuccess: 'Saved successfully',
        deleteSuccess: 'Deleted successfully',
        noPermission: 'You do not have permission to perform this action',
      },
      table: {
        noData: 'No data available',
        loading: 'Loading...',
      },
    },
  },
  ru: {
    translation: {
      menu: {
        salesOrders: 'Заказы продаж',
        production: 'Производство',
        settings: 'Настройки',
      },
      actions: {
        create: 'Создать',
        edit: 'Редактировать',
        delete: 'Удалить',
        save: 'Сохранить',
        cancel: 'Отмена',
        export: 'Экспорт',
        approve: 'Утвердить',
        search: 'Поиск',
      },
      messages: {
        confirmDelete: 'Вы уверены, что хотите удалить?',
        saveSuccess: 'Успешно сохранено',
        deleteSuccess: 'Успешно удалено',
        noPermission: 'У вас нет прав для выполнения этого действия',
      },
      table: {
        noData: 'Нет данных',
        loading: 'Загрузка...',
      },
    },
  },
};

void i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
