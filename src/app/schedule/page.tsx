"use client";
import React, { useEffect, useState } from "react";
import supabase from "../supabase/supabaseClient";

export interface Schedule {
  id?: number;
  day: string;
  startTime: string;
  endTime: string;
  event: string;
}

const times = [
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
  "23:30"
];

const days = ["일", "월", "화", "수", "목", "금", "토"];

const ScheduleTable: React.FC = () => {
  const [optionBox, setOptionBox] = useState(false);
  const [cellEdit, setCellEdit] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editableSchedule, setEditableSchedule] = useState<Schedule | null>(
    null
  );
  const [newSchedule, setNewSchedule] = useState<Schedule | null>(null);

  const handleOptionBox = () => {
    setOptionBox((prev) => !prev); // 현재 상태를 반전시킴
  };
  const handleCellEdit = () => {
    setCellEdit((prev) => !prev); // 현재 상태를 반전시킴
  };

  const fetchSchedules = async () => {
    const { data, error } = await supabase.from("schedule").select("*");
    if (error) {
      console.error("Error fetching schedules:", error);
    } else {
      setSchedules(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleSave = async () => {
    const scheduleToSave = editableSchedule || newSchedule;
    if (scheduleToSave) {
      const { error } = await supabase
        .from("schedule")
        .upsert([scheduleToSave]);

      if (error) {
        console.error("Error updating schedule:", error);
      } else {
        // 새 일정 추가 후 초기화
        setEditableSchedule(null);
        setNewSchedule(null);
        fetchSchedules(); // 상태 업데이트 후 일정 재페치
      }
    } else {
      console.warn("No schedule to save.");
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("schedule").delete().match({ id });

    if (error) {
      console.error("Error deleting schedule:", error);
    } else {
      setSchedules((prev) => prev.filter((schedule) => schedule.id !== id));
    }
  };

  // 수정 완료 후 저장 및 editableSchedule 초기화
  const handleCompleteEdit = async () => {
    await handleSave(); // 수정 완료 후 저장
    setEditableSchedule(null); // 수정 완료 후 editableSchedule 초기화
  };

  const handleNewScheduleChange = (field: keyof Schedule, value: string) => {
    setNewSchedule(
      (prev) =>
        ({
          ...prev,
          [field]: value
        } as Schedule)
    );
  };

  const handleEditScheduleChange = (field: keyof Schedule, value: string) => {
    if (editableSchedule) {
      setEditableSchedule({
        ...editableSchedule,
        [field]: value
      });
    }
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setEditableSchedule(schedule);
  };

  return (
    <div className="schedule_wrap">
      <div className="title_box">
        <h3>일정표</h3>
      </div>
      {/* 새 일정 추가 폼 */}
      <div className="option_box">
        <button type="button" onClick={handleOptionBox}>
          일정 추가
        </button>
        {optionBox ? (
          <>
            <select
              value={newSchedule?.day || ""}
              onChange={(e) => handleNewScheduleChange("day", e.target.value)}
            >
              <option value="">요일 선택</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <select
              value={newSchedule?.startTime || ""}
              onChange={(e) =>
                handleNewScheduleChange("startTime", e.target.value)
              }
            >
              <option value="">시작 시간 선택</option>
              {times.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            <select
              value={newSchedule?.endTime || ""}
              onChange={(e) =>
                handleNewScheduleChange("endTime", e.target.value)
              }
            >
              <option value="">종료 시간 선택</option>
              {times.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="일정 내용"
              value={newSchedule?.event || ""}
              onChange={(e) => handleNewScheduleChange("event", e.target.value)}
            />
            <button onClick={handleSave}>저장</button>
          </>
        ) : (
          ""
        )}
      </div>
      <section>
        <table>
          <thead>
            <tr>
              <th>시간</th>
              {days.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8}>로딩 중...</td>
              </tr>
            ) : (
              times.map((time, timeIndex) => (
                <tr key={time}>
                  <td>{time}</td>
                  {days.map((day) => {
                    const schedule = schedules.find(
                      (s) => s.day === day && s.startTime === time
                    );

                    if (schedule) {
                      const startIndex = times.indexOf(schedule.startTime);
                      const endIndex = times.indexOf(schedule.endTime);
                      const rowSpan = endIndex - startIndex + 1;

                      if (timeIndex === startIndex) {
                        return (
                          <td key={day} rowSpan={rowSpan}>
                            {editableSchedule?.id === schedule.id ? (
                              <>
                                <input
                                  type="text"
                                  value={editableSchedule!.event}
                                  onChange={(e) =>
                                    handleEditScheduleChange(
                                      "event",
                                      e.target.value
                                    )
                                  }
                                />
                                <button onClick={handleCompleteEdit}>
                                  수정 완료
                                </button>
                                <button
                                  onClick={() => handleDelete(schedule.id!)}
                                >
                                  삭제
                                </button>
                              </>
                            ) : (
                              <div className="event">
                                <p onClick={handleCellEdit}>{schedule.event}</p>
                                {cellEdit ? (
                                  <div className="btn_box">
                                    <button
                                      onClick={() =>
                                        handleEditSchedule(schedule)
                                      }
                                    >
                                      수정
                                    </button>
                                    <button
                                      onClick={() => handleDelete(schedule.id!)}
                                    >
                                      삭제
                                    </button>
                                  </div>
                                ) : null}
                              </div>
                            )}
                          </td>
                        );
                      } else {
                        return null;
                      }
                    } else {
                      return <td key={day}></td>;
                    }
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ScheduleTable;
