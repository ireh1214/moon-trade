import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    router.back(); // 이전 페이지로 이동
  };

  return (
    <button onClick={handleBack} className='back_btn'>
      뒤로가기
    </button>
  );
}