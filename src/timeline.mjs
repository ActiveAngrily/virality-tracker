const timelineDateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const formatTimelineDate = (value) => value
  ? timelineDateFormatter.format(new Date(value)).toLocaleLowerCase("en")
  : "unavailable";

export const timelineEventView = (event, creator = {}) => {
  const name = creator.creator_name || event.creator_id;
  const handle = creator.creator_handle || "handle unavailable";
  const date = formatTimelineDate(event.first_adoption_at_utc);
  const precision = event.first_adoption_precision === "exact_time"
    ? "exact timestamp"
    : `approximate ${event.first_adoption_precision} precision`;
  const percentile = event.adoption_percentile === null
    ? "percentile unavailable"
    : `${Math.round(event.adoption_percentile * 100)}th percentile`;
  const status = event.early_adopter ? "early adopter" : "later adopter";
  const later = `${event.later_adopter_count} later adopter${event.later_adopter_count === 1 ? "" : "s"}`;

  return {
    name,
    handle,
    creatorLine: `${name} ${handle}`,
    observedLine: `${date} · ${precision}`,
    rankLine: `rank ${event.adoption_rank} · ${percentile}`,
    statusLine: `${status} · ${later}`,
    label: `${name}, ${handle}; first observed ${date}; adoption rank ${event.adoption_rank}; ${status}; ${later}`,
  };
};

export const nextTimelineIndex = (key, index, length) => {
  if (!length) return null;
  if (key === "Home") return 0;
  if (key === "End") return length - 1;
  if (key === "ArrowRight" || key === "ArrowDown") return (index + 1) % length;
  if (key === "ArrowLeft" || key === "ArrowUp") return (index - 1 + length) % length;
  return null;
};

export const timelineLanes = (positions, minimumGap) => {
  const lastPositionByLane = [];
  return positions.map((position) => {
    let lane = lastPositionByLane.findIndex((lastPosition) => position - lastPosition >= minimumGap);
    if (lane === -1) lane = lastPositionByLane.length;
    lastPositionByLane[lane] = position;
    return lane;
  });
};

export const bindAdoptionTimeline = (section) => {
  if (!section) return;
  const dots = [...section.querySelectorAll("[data-timeline-dot]")];
  const items = [...section.querySelectorAll("[data-timeline-item]")];
  const summaryName = section.querySelector("[data-timeline-summary-name]");
  const summaryDetails = section.querySelector("[data-timeline-summary-details]");
  if (!dots.length || dots.length !== items.length || !summaryName || !summaryDetails) return;

  const initialSummary = [summaryName.textContent, summaryDetails.textContent];
  let selectedIndex = null;

  const corresponding = (index = null) => {
    dots.forEach((dot, candidate) => dot.classList.toggle("is-corresponding", candidate === index));
    items.forEach((item, candidate) => item.classList.toggle("is-corresponding", candidate === index));
  };

  const select = (index = null) => {
    selectedIndex = index;
    dots.forEach((dot, candidate) => dot.setAttribute("aria-pressed", String(candidate === index)));
    items.forEach((item, candidate) => {
      const selected = candidate === index;
      item.classList.toggle("is-selected", selected);
      item.querySelector("[data-selected-label]").hidden = !selected;
    });
    summaryName.textContent = index === null ? initialSummary[0] : dots[index].dataset.creator;
    summaryDetails.textContent = index === null ? initialSummary[1] : dots[index].dataset.details;
  };

  const targetIndex = (target) => {
    const dot = target.closest?.("[data-timeline-dot]");
    if (dot && section.contains(dot)) return { index: dots.indexOf(dot), nodes: dots };
    const item = target.closest?.("[data-timeline-item]");
    if (item && section.contains(item)) return { index: items.indexOf(item), nodes: items };
    return null;
  };

  section.addEventListener("click", (event) => {
    const target = event.target.closest?.("[data-timeline-dot]");
    if (!target || !section.contains(target)) return;
    const index = dots.indexOf(target);
    select(index);
    items[index].focus({ preventScroll: true });
    items[index].scrollIntoView({ block: "nearest" });
  });

  section.addEventListener("focusin", (event) => {
    const target = targetIndex(event.target);
    if (target) corresponding(target.index);
  });

  section.addEventListener("focusout", (event) => {
    if (!section.contains(event.relatedTarget)) corresponding();
  });

  section.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && selectedIndex !== null) {
      event.preventDefault();
      select();
      return;
    }
    const target = targetIndex(event.target);
    if (!target) return;
    const next = nextTimelineIndex(event.key, target.index, target.nodes.length);
    if (next === null) return;
    event.preventDefault();
    target.nodes[next].focus();
    if (target.nodes === items) target.nodes[next].scrollIntoView({ block: "nearest" });
  });
};
