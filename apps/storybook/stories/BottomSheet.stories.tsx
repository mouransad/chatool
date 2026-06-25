import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  BottomSheet,
  BottomSheetTrigger,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetDescription,
  BottomSheetBody,
  BottomSheetFooter,
  BottomSheetClose,
} from "@chatool/ui/bottom-sheet";
import Button from "@chatool/ui/button";

const meta = {
  title: "UI/BottomSheet",
  component: BottomSheet,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <BottomSheet>
      <BottomSheetTrigger asChild>
        <Button>Open bottom sheet</Button>
      </BottomSheetTrigger>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetTitle>Edit profile</BottomSheetTitle>
          <BottomSheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </BottomSheetDescription>
        </BottomSheetHeader>
        <BottomSheetBody>
          <p className="text-sm text-muted-foreground">
            Drag the handle or tap outside to dismiss. The sheet slides up from the
            bottom and the overlay fades in — both driven by the design tokens.
          </p>
        </BottomSheetBody>
        <BottomSheetFooter>
          <Button>Save changes</Button>
          <BottomSheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </BottomSheetClose>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  ),
};
