export const generateMessage = (notification: any) => {
  if (
    notification.enforcer_id &&
    !notification.passenger_id &&
    !notification.complainant_name
  ) {
    return `Enforcer: ${notification.enforcer_name} reported ${notification.driver_name} due to ${notification.complain}.`;
  } else if (
    !notification.enforcer_id &&
    notification.passenger_id &&
    !notification.complainant_name
  ) {
    return `Passenger: ${notification.passenger_name} reported ${notification.driver_name} due to ${notification.complain}.`;
  } else if (
    !notification.enforcer_id &&
    !notification.passenger_id &&
    notification.complainant_name
  ) {
    return `Anon Passenger: ${notification.complainant_name} reported ${notification.driver_name} due to ${notification.complain}.`;
  }
  return "";
};
