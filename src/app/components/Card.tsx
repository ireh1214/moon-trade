export default function Card() {
  return (
    <div className="card_container">
      <div>
        <div className="profile_img" />

        <div className="profile_txt">
          <p>루니클</p>
          <p>엘레멘탈나이트</p>
        </div>

        <ul className="color_content">
          <li>
            지향색: <span>#000000</span> <div className="color" />
          </li>
          <li>
            지향색: <span>#000000</span> <div className="color" />
          </li>
        </ul>
      </div>
    </div>
  );
}
