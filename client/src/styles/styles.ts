export const stateCardStyle = {
  waiting:
    "border-yellow-200 bg-gradient-to-r from-yellow-50/80 to-yellow-50/30",
  active:
    "border-violet-200 bg-gradient-to-r from-violet-50/80 to-violet-50/30",
  completed:
    "border-green-200 bg-gradient-to-r from-green-50/80 to-green-50/30",
  failed: "border-red-200 bg-gradient-to-r from-red-50/80 to-red-50/30",
  delayed:
    "border-orange-200 bg-gradient-to-r from-orange-50/80 to-orange-50/30",
};

export const stateIconStyle = {
  waiting: "text-yellow-500 group-hover:text-yellow-600",
  active: "text-violet-500 group-hover:text-violet-600 animate-spin",
  completed: "text-green-500 group-hover:text-green-600",
  failed: "text-red-500 group-hover:text-red-600",
  delayed: "text-orange-500 group-hover:text-orange-600",
};

export const stateBadgeStyle = {
  waiting: "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20",
  active: "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-600/20",
  completed: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20",
  failed: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20",
  delayed: "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/20",
};

export const progressStyle = {
  waiting: "bg-yellow-500",
  active: "bg-violet-500",
  completed: "bg-green-500",
  failed: "bg-red-500",
  delayed: "bg-orange-500",
};
