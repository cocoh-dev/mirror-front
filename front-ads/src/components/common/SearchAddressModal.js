import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DaumPostcode from "react-daum-postcode";

export default function SearchAddressModal({ isOpen, onClose, onCompletePost }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>주소 검색</DialogTitle>
        </DialogHeader>
        <DaumPostcode
          onComplete={(data) => {
            onCompletePost(data); // 주소 선택 후 데이터 전달
            onClose(); // 모달 자동 닫기
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
