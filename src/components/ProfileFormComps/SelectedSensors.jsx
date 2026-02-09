import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

const SelectedSensors = ({ selectedSensors, setSelectedSensors }) => {
  // Enable drag sensor
  const sensors = useSensors(useSensor(PointerSensor));

  // ---- DRAG END HANDLER ----
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = selectedSensors.findIndex(
        (s) => s.sensorId === active.id
      );
      const newIndex = selectedSensors.findIndex((s) => s.sensorId === over.id);

      setSelectedSensors((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  // ---- SORTABLE ITEM ----
  const SortableItem = ({ sensor }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: sensor.sensorId });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <li
        ref={setNodeRef}
        style={style}
        className="station-profile-darg-item"
        {...attributes}
        {...listeners}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            className="me-2 d-none"
            data-id={sensor.sensorId}
          />
          {sensor.sensorName}
        </div>
        <span style={{ cursor: "grab" }}>⋮⋮</span>
      </li>
    );
  };

  return (
    <div className="station-profile-accordian-cont">
      <h6 className="station-profile-accordian-heading">Selected Sensors</h6>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={selectedSensors.map((s) => s.sensorId)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="list-group">
            {selectedSensors.map((sensor) => (
              <SortableItem key={sensor.sensorId} sensor={sensor} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default SelectedSensors;
