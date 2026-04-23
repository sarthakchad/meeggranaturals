import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
export default function ProductDetails({ product }) {
  return (
    <div className="border-t border-border pt-8">
      <Accordion type="multiple" defaultValue={["description"]}>
        {product.long_description && (
          <AccordionItem value="description"><AccordionTrigger className="font-display text-lg">Description</AccordionTrigger>
            <AccordionContent><p className="text-sm text-muted-foreground leading-relaxed">{product.long_description}</p></AccordionContent>
          </AccordionItem>
        )}
        {product.how_to_use && (
          <AccordionItem value="howto"><AccordionTrigger className="font-display text-lg">How to Use</AccordionTrigger>
            <AccordionContent><p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{product.how_to_use}</p></AccordionContent>
          </AccordionItem>
        )}
        {product.ingredients && (
          <AccordionItem value="ingredients"><AccordionTrigger className="font-display text-lg">Ingredients</AccordionTrigger>
            <AccordionContent><p className="font-mono text-xs text-muted-foreground leading-relaxed">{product.ingredients}</p></AccordionContent>
          </AccordionItem>
        )}
        <AccordionItem value="details"><AccordionTrigger className="font-display text-lg">Product Details</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {product.size && <div><span className="text-muted-foreground">Size</span><p>{product.size}</p></div>}
              {product.skin_types?.length > 0 && <div><span className="text-muted-foreground">Skin Types</span><p className="capitalize">{product.skin_types.join(", ")}</p></div>}
              {product.hair_types?.length > 0 && <div><span className="text-muted-foreground">Hair Types</span><p className="capitalize">{product.hair_types.join(", ")}</p></div>}
              {product.concerns?.length > 0 && <div><span className="text-muted-foreground">Concerns</span><p className="capitalize">{product.concerns.map(c => c.replace("_", " ")).join(", ")}</p></div>}
              {product.gender && <div><span className="text-muted-foreground">For</span><p className="capitalize">{product.gender}</p></div>}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
