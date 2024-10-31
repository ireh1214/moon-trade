/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import supabase from "../supabase/supabaseClient";

interface Schedule {
  id: number;
  day: string;
  time: string;
  event: string;
  friend: string;
  empty: string;
  detail?: string;
}

const days = [
  "일요일",
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일"
];

const WeeklySchedule: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [newSchedule, setNewSchedule] = useState({
    day: days[0],
    time: "",
    event: "",
    friend: "",
    empty: "",
    detail: ""
  });
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );

  const fetchSchedules = async () => {
    const { data, error } = await supabase.from("schedule").select("*");
    if (error) console.error(error);
    else setSchedules(data as Schedule[]);
  };

  const createSchedule = async () => {
    const { day, time, event, friend, empty, detail } = newSchedule;
    const { error } = await supabase
      .from("schedule")
      .insert([{ day, time, event, friend, empty, detail }]);
    if (error) {
      console.error("Error adding schedule:", error.message);
    } else {
      fetchSchedules();
      setNewSchedule({
        day: days[0],
        time: "",
        event: "",
        friend: "",
        empty: "",
        detail: ""
      });
    }
  };

  const updateSchedule = async () => {
    if (!editingSchedule) return;
    const { id, day, time, event, friend, empty, detail } = editingSchedule;
    const { error } = await supabase
      .from("schedule")
      .update({ day, time, event, friend, empty, detail })
      .eq("id", id);
    if (error) {
      console.error("Error updating schedule:", error.message);
    } else {
      fetchSchedules();
      setEditingSchedule(null);
      setSelectedSchedule(null); // 수정 후 선택 해제
    }
  };

  const deleteSchedule = async (id: number) => {
    const { error } = await supabase.from("schedule").delete().eq("id", id);
    if (error) {
      console.error("Error deleting schedule:", error.message);
    } else {
      fetchSchedules();
      setSelectedSchedule(null); // 삭제 후 선택 해제
    }
  };

  const handleFriendClick = (schedule: Schedule) => {
    setSelectedSchedule((prev) => (prev?.id === schedule.id ? null : schedule));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".schedule_wrap")) {
        setSelectedSchedule(null); // table 외부 클릭 시 선택 해제
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 화면 크기 변경 감지
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div className="schedule_wrap">
      <div className="title_box">
        <h3>스케줄 ver1.0.5</h3>
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
          type="text"
          className="input_empty"
          placeholder="모자란 인원"
          value={editingSchedule ? editingSchedule.empty : newSchedule.empty}
          onChange={(e) => {
            const value = e.target.value;
            if (editingSchedule) {
              setEditingSchedule({ ...editingSchedule, empty: value });
            } else {
              setNewSchedule({ ...newSchedule, empty: value });
            }
          }}
        />
        <input
          type="text"
          className="input_detail"
          placeholder="추가 설명(안써도됨)"
          value={
            editingSchedule ? editingSchedule.detail || "" : newSchedule.detail
          }
          onChange={(e) => {
            const value = e.target.value;
            if (editingSchedule) {
              setEditingSchedule({ ...editingSchedule, detail: value });
            } else {
              setNewSchedule({ ...newSchedule, detail: value });
            }
          }}
        />
        {editingSchedule ? (
          <button onClick={updateSchedule}>수정하기</button>
        ) : (
          <button onClick={createSchedule}>추가하기</button>
        )}
      </div>
      {isMobile ? (
        days.map((day) => (
          <div key={day} className="day_schedule_mo">
            <em>{day}</em>
            <ul>
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
                  <li key={schedule.id} className="time_entry">
                    <p>
                      {schedule.time} / {schedule.event}
                    </p>
                    <p>🐶 참여하는 길드원: {schedule.friend}</p>
                    <p>❗ 공석: {schedule.empty}</p>
                    {schedule.detail && <p>🗨 설명: {schedule.detail}</p>}
                  </li>
                ))}
            </ul>
          </div>
        ))
      ) : (
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
                        onClick={() => handleFriendClick(schedule)}
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
                      </div>
                    ))}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      )}

      {selectedSchedule && (
        <div className="detail_value">
          <div className="desc">
            <span>🗨 설명:</span>
            <p>{selectedSchedule.detail}</p>
          </div>
          <div>
            <span>🐶 참여하는 길드원:</span>
            <p>{selectedSchedule.friend}</p>
          </div>
          <div>
            <span>❗ 공석:</span>
            <p>{selectedSchedule.empty}</p>
          </div>
          <div className="btn_box">
            <button onClick={() => setEditingSchedule(selectedSchedule)}>
              수정
            </button>
            <button onClick={() => deleteSchedule(selectedSchedule.id)}>
              삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklySchedule;
