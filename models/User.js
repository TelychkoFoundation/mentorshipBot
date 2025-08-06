import mongoose, { Schema, Types } from "mongoose";

// Схема для подписки
const SubscriptionSchema = new Schema({
    active: {
        type: Boolean,
        required: true,
        default: false,
    },
    started_at: {
        type: Date,
    },
    ends_at: {
        type: Date,
    },
    auto_renew: {
        type: Boolean,
        required: true,
        default: false,
    },
});

// Схема прогресса уроков (lesson_progress)
const LessonProgressSchema = new Schema({
    lesson_id: {
        type: Types.ObjectId, // Связь с уроком
        required: true,
        ref: "Lesson",
    },
    course_id: {
        type: Types.ObjectId, // Связь с курсом, которому принадлежит урок
        required: true,
        ref: "Course",
    },
    watched_at: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number, // Продолжительность в секундах
        default: 0,
    },
    completed: {
        type: Boolean,
        required: true,
        default: false,
    },
});

// Схема напоминаний (reminders)
const ReminderSchema = new Schema({
    lesson_id: {
        type: Types.ObjectId,
        ref: "Lesson", // Связь с уроком
        required: false,
    },
    course_id: {
        type: Types.ObjectId,
        ref: "Course", // Связь с курсом
        required: false,
    },
    reminder_at: {
        type: Date, // Дата и время напоминания
        required: true,
    },
    status: {
        type: String, // "active", "completed", "missed"
        default: "active",
    },
});

// Схема отзывов и рейтингов (reviews)
const ReviewSchema = new Schema({
    course_id: {
        type: Types.ObjectId,
        ref: "Course", // Связь с курсом
        required: true,
    },
    rating: {
        type: Number, // Рейтинг (например, от 1 до 5)
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String, // Комментарий
        maxlength: 2000, // Максимальная длина комментария
    },
    created_at: {
        type: Date,
        default: Date.now, // Дата создания отзыва
    },
});

// Схема для реферальной системы (referrals)
const ReferralSchema = new Schema({
    referred_user_id: {
        type: Types.ObjectId, // Ссылка на приглашённого пользователя
        ref: "User",
        required: true,
    },
    referred_at: {
        type: Date, // Дата приглашения
        default: Date.now,
    },
    bonus_granted: {
        type: Boolean, // Был ли предоставлен бонус
        default: false,
    },
});

// Основная модель пользователя
const UserSchema = new Schema(
    {
        id: {
            type: Number,
            required: [true, "Telegram ID is required"],
            unique: true,
            index: true,
        },
        first_name: {
            type: String,
            required: [true, "First name is required"],
        },
        last_name: {
            type: String,
            required: false,
        },
        username: {
            type: String,
            required: false,
            unique: true,
            sparse: true,
        },
        photo_url: {
            type: String,
            required: false,
        },
        auth_date: {
            type: Number,
            required: [true, "Auth date is required"],
        },
        hash: {
            type: String,
            required: [true, "Hash is required"],
        },

        // Покупки
        purchased_lessons: [
            {
                lesson_id: { type: Types.ObjectId, ref: "Lesson", required: true },
                course_id: { type: Types.ObjectId, ref: "Course", required: true },
                purchased_at: { type: Date, default: Date.now },
                invoice_id: { type: String, required: true },
            },
        ],
        purchased_courses: [
            {
                course_id: { type: Types.ObjectId, ref: "Course", required: true },
                purchased_at: { type: Date, default: Date.now },
            },
        ],
        subscription: {
            type: SubscriptionSchema, // Подписка
            required: true,
            default: () => ({}),
        },

        // Прогресс уроков
        lesson_progress: [
            {
                type: LessonProgressSchema, // Прогресс урока
                required: false,
            },
        ],

        // Напоминания
        reminders: [
            {
                type: ReminderSchema, // Логика напоминаний
                required: false,
            },
        ],

        // Отзывы и рейтинги
        reviews: [
            {
                type: ReviewSchema, // Логика отзывов
                required: false,
            },
        ],

        // Реферальная система
        referrals: [
            {
                type: ReferralSchema, // Приглашённые пользователи
                required: false,
            },
        ],

        // Геймификация
        xp: {
            type: Number,
            required: false,
            default: 0, // Начальное количество опыта
        },
        level: {
            type: Number,
            required: false,
            default: 1, // Стартовый уровень
        },
        my_courses: [
            {
                course_id: {
                    type: Types.ObjectId, // ID курса
                    ref: "Course",
                    required: true,
                },
                started_on: {
                    type: Date, // Дата начала курса
                    default: () => new Date(),
                },
                status: {
                    type: String, // Статус курса
                    enum: ["in_progress", "completed"],
                    default: "in_progress",
                },
            },
        ],

        // Прочее
        total_spent: {
            type: Number,
            required: false,
            default: 0, // Общая сумма потраченных средств
        },

        mentorship: {
            expiresAt: { type: Date, default: null },
            questionsLeft: { type: Number, default: 0 },
        },

        // Последний вход
        lastLogin: {
            type: Date,
            required: false,
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

export default  mongoose.models.User || mongoose.model('User', UserSchema);
