"use client";
import React, { useEffect, useState } from "react";
import supabase from "../supabase/supabaseClient";

const days = [
  "일요일",
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일"
];

interface Schedule {
  id: number;
  day: string;
  time: string;
  event: string;
  friend: string; // 'member'를 'friend'로 변경
  empty: string; // 'empty'를 string으로 변경
}

const WeeklySchedule: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [newSchedule, setNewSchedule] = useState({
    day: days[0],
    time: "",
    event: "",
    friend: "", // 'member'를 'friend'로 변경
    empty: "" // 'empty'를 추가
  });
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]); // 선택된 친구 상태 추가
  const [detailVisible, setDetailVisible] = useState(false); // 상세보기 상태 추가

  // 데이터베이스에서 데이터를 가져오는 함수 (Read)
  const fetchSchedules = async () => {
    const { data, error } = await supabase.from("schedule").select("*");
    if (error) console.error(error);
    else setSchedules(data as Schedule[]);
  };

  // 스케줄 추가 함수 (Create)
  const createSchedule = async () => {
    const { day, time, event, friend, empty } = newSchedule; // 'member'를 'friend'로 변경
    const { error } = await supabase
      .from("schedule")
      .insert([{ day, time, event, friend, empty }]); // 'member'를 'friend'로 변경
    if (error) {
      console.error("Error adding schedule:", error.message);
    } else {
      fetchSchedules();
      setNewSchedule({
        day: days[0],
        time: "",
        event: "",
        friend: "",
        empty: ""
      }); // 초기화
    }
  };

  // 스케줄 수정 함수 (Update)
  const updateSchedule = async () => {
    if (!editingSchedule) return;
    const { id, day, time, event, friend, empty } = editingSchedule; // 'member'를 'friend'로 변경
    const { error } = await supabase
      .from("schedule")
      .update({ day, time, event, friend, empty }) // 'member'를 'friend'로 변경
      .eq("id", id);
    if (error) {
      console.error("Error updating schedule:", error.message);
    } else {
      fetchSchedules();
      setEditingSchedule(null);
    }
  };

  // 스케줄 삭제 함수 (Delete)
  const deleteSchedule = async (id: number) => {
    const { error } = await supabase.from("schedule").delete().eq("id", id);
    if (error) {
      console.error("Error deleting schedule:", error.message);
    } else {
      fetchSchedules();
    }
  };

  // 참여자 추가 핸들러
  const handleFriendClick = (friend: string) => {
    if (selectedFriends.includes(friend)) {
      // 친구가 이미 선택되어 있으면 제거
      setSelectedFriends((prev) => prev.filter((f) => f !== friend));
    } else {
      // 친구가 선택되지 않았으면 추가
      setSelectedFriends((prev) => [...prev, friend]);
    }
    setDetailVisible(!detailVisible); // 클릭할 때마다 상세보기 토글
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div className="schedule_wrap">
      <div className="title_box">
        <h3>스케줄 ver1.0.0</h3>
      </div>
      <div className="option_box">
        <select
          value={editingSchedule ? editingSchedule.day : newSchedule.day}
          onChange={(e) => {
            const value = e.target.value;
            if (editingSchedule) {
              setEditingSchedule({ ...editingSchedule, day: value });
            } else {
              setNewSchedule({ ...newSchedule, day: value });
            }
          }}
        >
          {days.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
        <input
          type="text"
          className="input_time"
          placeholder="몇 시?"
          value={editingSchedule ? editingSchedule.time : newSchedule.time}
          onChange={(e) => {
            const value = e.target.value;
            if (editingSchedule) {
              setEditingSchedule({ ...editingSchedule, time: value });
            } else {
              setNewSchedule({ ...newSchedule, time: value });
            }
          }}
        />
        <input
          type="text"
          className="input_schedule"
          placeholder="일정은?"
          value={editingSchedule ? editingSchedule.event : newSchedule.event}
          onChange={(e) => {
            const value = e.target.value;
            if (editingSchedule) {
              setEditingSchedule({ ...editingSchedule, event: value });
            } else {
              setNewSchedule({ ...newSchedule, event: value });
            }
          }}
        />
        <input
          type="text"
          className="input_friend"
          placeholder="참여 길드원"
          value={editingSchedule ? editingSchedule.friend : newSchedule.friend}
          onChange={(e) => {
            const value = e.target.value;
            if (editingSchedule) {
              setEditingSchedule({ ...editingSchedule, friend: value });
            } else {
              setNewSchedule({ ...newSchedule, friend: value });
            }
          }}
        />
        <input
          type="text" // 'empty'를 문자열 입력 필드로 변경
          className="input_empty"
          placeholder="모자란 인원"
          value={editingSchedule ? editingSchedule.empty : newSchedule.empty}
          onChange={(e) => {
            const value = e.target.value; // 입력값을 문자열로 설정
            if (editingSchedule) {
              setEditingSchedule({ ...editingSchedule, empty: value });
            } else {
              setNewSchedule({ ...newSchedule, empty: value });
            }
          }}
        />
        {editingSchedule ? (
          <button onClick={updateSchedule}>수정하기</button>
        ) : (
          <button onClick={createSchedule}>추가하기</button>
        )}
      </div>

      <table>
        <thead>
          <tr>
            {days.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {days.map((day) => (
              <td key={day}>
                {schedules
                  .filter((schedule) => schedule.day === day)
                  .sort((a, b) => {
                    const parseTime = (time: string) => {
                      const isPM = time.includes("오후");
                      let hour = parseInt(time.replace(/[^0-9]/g, ""), 10);
                      if (isPM && hour !== 12) hour += 12;
                      if (!isPM && hour === 12) hour = 0;
                      return hour;
                    };
                    return parseTime(a.time) - parseTime(b.time);
                  })
                  .map((schedule) => (
                    <div
                      key={schedule.id}
                      className="value"
                      onClick={() => handleFriendClick(schedule.friend)}
                    >
                      <p className="time_value">{schedule.time}</p>
                      {schedule.event.split("\n").map((line, index) => (
                        <p
                          key={index}
                          className="event_value"
                          dangerouslySetInnerHTML={{
                            __html: line.replace(/(\\n)/g, "<br />")
                          }}
                        />
                      ))}
                      {/* 참여자 출력 */}
                      {selectedFriends.includes(schedule.friend) && ( // 선택된 친구일 때만 btn_box 보여줌
                        <div className="btn_box">
                          <button onClick={() => setEditingSchedule(schedule)}>
                            수정
                          </button>
                          <button onClick={() => deleteSchedule(schedule.id)}>
                            삭제
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      {detailVisible && selectedFriends.length > 0 && (
        <div className="detail_value">
          <div>
            <span>참여하는 길드원:</span>
            {selectedFriends.map((friend, index) => (
              <p key={index}>{friend}</p>
            ))}
          </div>
          <div>
            <span>공석:</span>
            {
              schedules
                .filter((schedule) => selectedFriends.includes(schedule.friend))
                .reduce((acc, schedule) => acc + schedule.empty, "") // 문자열을 그대로 합산
            }
            명
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklySchedule;
