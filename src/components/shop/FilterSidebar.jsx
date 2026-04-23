import { X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

const filterGroups = [
  { key: "category", label: "Category", options: [{ value: "skincare", label: "Skincare" }, { value: "haircare", label: "Haircare" }, { value: "combo", label: "Combos" }] },
  { key: "concern", label: "Concern", options: [{ value: "acne", label: "Acne" }, { value: "dryness", label: "Dryness" }, { value: "oiliness", label: "Oiliness" }, { value: "aging", label: "Aging" }, { value: "dark_spots", label: "Dark Spots" }, { value: "sensitivity", label: "Sensitivity" }, { value: "hair_fall", label: "Hair Fall" }, { value: "dandruff", label: "Dandruff" }, { value: "frizz", label: "Frizz" }, { value: "damaged_hair", label: "Damaged Hair" }] },
  { key: "skin_type", label: "Skin Type", options: [{ value: "oily", label: "Oily" }, { value: "dry", label: "Dry" }, { value: "combination", label: "Combination" }, { value: "sensitive", label: "Sensitive" }, { value: "normal", label: "Normal" }] },
  { key: "hair_type", label: "Hair Type", options: [{ value: "oily", label: "Oily" }, { value: "dry", label: "Dry" }, { value: "curly", label: "Curly" }, { value: "straight", label: "Straight" }, { value: "wavy", label: "Wavy" }] },
];

export default function FilterSidebar({ filters, onFilterChange, mobileOpen, onMobileClose }) {
  const isActive = (group, value) => filters[group]?.includes(value);
  const toggleFilter = (group, value) => {
    const current = filters[group] || [];
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onFilterChange({ ...filters, [group]: updated });
  };
  const activeCount = Object.values(filters).reduce((sum, arr) => sum + (arr?.length || 0), 0);

  const content = (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xl tracking-wide">Filters</h3>
        {activeCount > 0 && <button onClick={() => onFilterChange({})} className="text-xs text-muted-foreground hover:text-foreground underline">Clear all ({activeCount})</button>}
      </div>
      <Accordion type="multiple" defaultValue={["category", "concern"]}>
        {filterGroups.map((group) => (
          <AccordionItem key={group.key} value={group.key}>
            <AccordionTrigger className="text-sm font-medium py-3">{group.label}{filters[group.key]?.length > 0 && <span className="ml-2 text-xs text-primary">({filters[group.key].length})</span>}</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-3 pb-2">
                {group.options.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                    <Checkbox checked={isActive(group.key, opt.value)} onCheckedChange={() => toggleFilter(group.key, opt.value)} />
                    <span className="text-sm text-muted-foreground">{opt.label}</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block w-64 flex-shrink-0">{content}</div>
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onMobileClose} />
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-background shadow-2xl p-6 overflow-y-auto animate-slide-in-right">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display text-lg">Filters</span>
              <button onClick={onMobileClose} className="p-2"><X className="w-5 h-5" /></button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
