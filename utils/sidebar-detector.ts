let isSidebar = false;

export function toggleIsSidebar() {
  isSidebar = !isSidebar;
  return isSidebar;
}

export function getIsSidebar() {
  return isSidebar;
}
