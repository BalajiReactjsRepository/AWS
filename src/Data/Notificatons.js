const performedBys = [
  "Rajinik Babariya",
  "Priya Patel",
  "Anil Shah",
  "Sneha Mehta",
  "Kunal Desai",
  "Rina Roy",
  "Nitesh Kumar",
  "Pooja Sharma",
  "Deepak Joshi",
  "Meera Singh",
];

const notifyType = ["Mail", "SMS"];

const roles = [
  "System Admin",
  "Admin",
  "General User",
  "Department",
  "Support",
  "Manager",
  "Operator",
  "Supervisor",
  "Executive",
  "Auditor",
];

const dates = Array.from({ length: 50 }, (_, i) => {
  const date = new Date(2024, 5, 1); // June 1, 2024
  date.setDate(date.getDate() + i);
  return date.toISOString().split("T")[0];
});

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const notifications = Array.from({ length: 50 }, (_, i) => {
  return {
    key: i + 1,
    notify: getRandomItem(notifyType),
    title: `Sensor value high ${i + 1}`,
    description: `Sensor ${i + 1} exceeded threshold`,
    clientName: `Client ${i + 1}`,
    role: getRandomItem(roles),
    user: `User-${i + 1}`,
    performedBy: `${getRandomItem(performedBys)} #${i + 1}`,
    performedOn: dates[i],
  };
});

export const notificatioList = [
  {
    key: 1,
    notificationTitle: "System Update",
    createdOn: "21-06-2024",
    notificationMessage:
      "A new system update will be applied tonight. duhufy fhehfuewfemnhfeufhefenfeuf enbwuidhewdw nmdhgwuidbd dgwhd bghsdbsb hsgs snsyugdbsn shcgsb sjhgsd sngsjb sshgsd snbs sncsbcusbc sc hsgcsh csancbsjhcs c",
  },
  {
    key: 2,
    notificationTitle: "Maintenance Alert",
    createdOn: "22-06-2024",
    notificationMessage: "Scheduled maintenance will occur on 23-06-2024.",
  },
  {
    key: 3,
    notificationTitle: "New Feature Released",
    createdOn: "23-06-2024",
    notificationMessage: "We’ve added a new dashboard view. Check it out now!",
  },
  {
    key: 4,
    notificationTitle: "Policy Update",
    createdOn: "24-06-2024",
    notificationMessage:
      "Our privacy policy has been updated. Please review it.",
  },
  {
    key: 5,
    notificationTitle: "Reminder",
    createdOn: "25-06-2024",
    notificationMessage:
      "Don’t forget to submit your monthly report by tomorrow.",
  },
  {
    key: 6,
    notificationTitle: "Survey",
    createdOn: "26-06-2024",
    notificationMessage:
      "We value your feedback. Please complete our short survey.",
  },
  {
    key: 7,
    notificationTitle: "Outage Notice",
    createdOn: "27-06-2024",
    notificationMessage: "There will be a brief outage tonight at midnight.",
  },
  {
    key: 8,
    notificationTitle: "Security Tip",
    createdOn: "28-06-2024",
    notificationMessage: "Don’t share your password with anyone.",
  },
  {
    key: 9,
    notificationTitle: "App Update",
    createdOn: "29-06-2024",
    notificationMessage: "A new version of the app is available for download.",
  },
  {
    key: 10,
    notificationTitle: "Holiday Notice",
    createdOn: "30-06-2024",
    notificationMessage:
      "Our offices will be closed on 01-07-2024 for the holiday.",
  },
  {
    key: 11,
    notificationTitle: "Performance Review",
    createdOn: "01-07-2024",
    notificationMessage:
      "Your annual performance review is scheduled next week.",
  },
  {
    key: 12,
    notificationTitle: "Webinar Invitation",
    createdOn: "02-07-2024",
    notificationMessage: "Join us for a webinar on product updates.",
  },
  {
    key: 13,
    notificationTitle: "Login Alert",
    createdOn: "03-07-2024",
    notificationMessage: "You logged in from a new device.",
  },
  {
    key: 14,
    notificationTitle: "Feedback Request",
    createdOn: "04-07-2024",
    notificationMessage: "Let us know how we’re doing.",
  },
  {
    key: 15,
    notificationTitle: "System Downtime",
    createdOn: "05-07-2024",
    notificationMessage: "Expect downtime this weekend for maintenance.",
  },
  {
    key: 16,
    notificationTitle: "Event Reminder",
    createdOn: "06-07-2024",
    notificationMessage: "Don’t forget the all-hands meeting tomorrow.",
  },
  {
    key: 17,
    notificationTitle: "Password Expiry",
    createdOn: "07-07-2024",
    notificationMessage: "Your password will expire in 3 days.",
  },
  {
    key: 18,
    notificationTitle: "Support Ticket Update",
    createdOn: "08-07-2024",
    notificationMessage: "Your support ticket has been updated.",
  },
  {
    key: 19,
    notificationTitle: "New Message",
    createdOn: "09-07-2024",
    notificationMessage: "You have received a new internal message.",
  },
  {
    key: 20,
    notificationTitle: "Weekly Summary",
    createdOn: "10-07-2024",
    notificationMessage: "Your weekly activity summary is available.",
  },
  {
    key: 21,
    notificationTitle: "Storage Warning",
    createdOn: "11-07-2024",
    notificationMessage: "You’re nearing your storage limit.",
  },
  {
    key: 22,
    notificationTitle: "Training Session",
    createdOn: "12-07-2024",
    notificationMessage: "A training session is scheduled for 14-07-2024.",
  },
  {
    key: 23,
    notificationTitle: "Bug Fixes",
    createdOn: "13-07-2024",
    notificationMessage: "We’ve fixed several reported bugs.",
  },
  {
    key: 24,
    notificationTitle: "Welcome Aboard",
    createdOn: "14-07-2024",
    notificationMessage: "Welcome to the team! We’re excited to have you.",
  },
  {
    key: 25,
    notificationTitle: "Update Required",
    createdOn: "15-07-2024",
    notificationMessage: "Please update your contact information.",
  },
];
