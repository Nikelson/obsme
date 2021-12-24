import { store as notifyStore } from 'react-notifications-component';
import config from './config';

let notifications = [];

const notify = {
    show: ({ title, message = " ", ...rest }, type) => {
        if (config.isProduction) {
            return
        }

        const not = notifyStore.addNotification({
            ...config.notificationOptions,
            ...rest,
            title: title,
            message: message,
            type: type,
            onRemoval: (id, removedBy) => {
                notifications = notifications.filter(item => item != id);
            }
        });
        notifications.push(not);
        return not;
    },
    error: (props, type = 'danger') => notify.show({
        ...props,
        dismiss: { ...config.notificationOptions.dismissError },
    }, type),
    success: (props, type = 'success') => notify.show(props, type),
    info: (props, type = 'info') => notify.show(props, type),
    warning: (props, type = 'warning') => notify.show(props, type),
    clear: () => notifications.forEach(notifyStore.removeNotification),
}

export default notify;