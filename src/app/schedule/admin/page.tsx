/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import React, { useEffect, useState } from "react";
import supabase from "../../supabase/supabaseClient";

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
}

const WeeklySchedule: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [newSchedule, setNewSchedule] = useState({
    day: days[0],
    time: "",
    event: ""
  });
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null); // 수정 상태

  // 데이터베이스에서 데이터를 가져오는 함수 (Read)
  const fetchSchedules = async () => {
    const { data, error } = await supabase.from("schedule").select("*");
    if (error) console.error(error);
    else setSchedules(data as Schedule[]);
  };

  // 스케줄 추가 함수 (Create)
  const createSchedule = async () => {
    const { day, time, event } = newSchedule;
    const { error } = await supabase
      .from("schedule")
      .insert([{ day, time, event }]);
    if (error) {
      console.error("Error adding schedule:", error.message);
    } else {
      fetchSchedules();
      setNewSchedule({ day: days[0], time: "", event: "" });
    }
  };

  // 스케줄 수정 함수 (Update)
  const updateSchedule = async () => {
    if (!editingSchedule) return;
    const { id, day, time, event } = editingSchedule;
    const { error } = await supabase
      .from("schedule")
      .update({ day, time, event })
      .eq("id", id);
    if (error) {
      console.error("Error updating schedule:", error.message);
    } else {
      fetchSchedules();
      setEditingSchedule(null); // 수정 상태 초기화
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

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div className="schedule_wrap">
      <div className="title_box">
        <h3>스케줄 테스트</h3>
      </div>
      <div className="option_box">
        <select
          value={editingSchedule ? editingSchedule.day : newSchedule.day}
          onChange={(e) => {
            const value = e.target.value;
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            editingSchedule
              ? setEditingSchedule({ ...editingSchedule, day: value })
              : setNewSchedule({ ...newSchedule, day: value });
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
          placeholder="몇 시?"
          value={editingSchedule ? editingSchedule.time : newSchedule.time}
          onChange={(e) => {
            const value = e.target.value;
            editingSchedule
              ? setEditingSchedule({ ...editingSchedule, time: value })
              : setNewSchedule({ ...newSchedule, time: value });
          }}
        />
        <input
          type="text"
          placeholder="일정은?"
          value={editingSchedule ? editingSchedule.event : newSchedule.event}
          onChange={(e) => {
            const value = e.target.value;
            editingSchedule
              ? setEditingSchedule({ ...editingSchedule, event: value })
              : setNewSchedule({ ...newSchedule, event: value });
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
                  .map((schedule) => (
                    <div key={schedule.id} className="">
                      {schedule.time}
                      {schedule.event}
                      <button onClick={() => setEditingSchedule(schedule)}>
                        수정
                      </button>
                      <button onClick={() => deleteSchedule(schedule.id)}>
                        삭제
                      </button>
                    </div>
                  ))}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WeeklySchedule;
