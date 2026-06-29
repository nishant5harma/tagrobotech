"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SectionEditor from "@/components/admin/SectionEditor";
import type { PageSection } from "@/lib/api";

type SortableSectionsListProps = {
  sections: PageSection[];
  onReorder: (sections: PageSection[]) => Promise<void>;
  onSave: (sectionId: string, data: Record<string, unknown>, isActive: boolean) => Promise<void>;
  onDelete: (sectionId: string) => Promise<void>;
};

type SortableSectionItemProps = {
  section: PageSection;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
  onDelete: () => Promise<void>;
};

function SortableSectionItem({ section, onSave, onDelete }: SortableSectionItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    opacity: isDragging ? 0.92 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <SectionEditor
        section={section}
        onSave={onSave}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      />
    </div>
  );
}

export default function SortableSectionsList({
  sections,
  onReorder,
  onSave,
  onDelete,
}: SortableSectionsListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((section) => section.id === active.id);
    const newIndex = sections.findIndex((section) => section.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const reordered = arrayMove(sections, oldIndex, newIndex).map((section, index) => ({
      ...section,
      position: index + 1,
    }));

    await onReorder(reordered);
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sections.map((section) => section.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {sections.map((section) => (
            <SortableSectionItem
              key={section.id}
              section={section}
              onSave={(data, isActive) => onSave(section.id, data, isActive)}
              onDelete={() => onDelete(section.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
