import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import DaumPostcode from "react-daum-postcode";

export default function SearchAddressModal({ isOpen, onClose, onCompletePost }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>주소 검색</DialogTitle>
        </DialogHeader>
        <DaumPostcode onComplete={onCompletePost} />
        <DialogClose asChild>
          <button className="mt-2 w-full py-2 bg-gray-800 text-white rounded">닫기</button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
