<?php

namespace Mcms\Events\Models\Filters;


use App;


use Carbon\Carbon;
use IdeaSeven\Core\QueryFilters\FilterableDate;
use IdeaSeven\Core\QueryFilters\FilterableExtraFields;
use IdeaSeven\Core\QueryFilters\FilterableLimit;
use IdeaSeven\Core\QueryFilters\FilterableOrderBy;
use IdeaSeven\Core\QueryFilters\QueryFilters;


class EventFilters extends QueryFilters
{
    use FilterableDate, FilterableOrderBy, FilterableLimit, FilterableExtraFields;

    /**
     * @var array
     */
    protected $filterable = [
        'id',
        'title',
        'slug',
        'description',
        'description_long',
        'userId',
        'active',
        'dateStart',
        'dateEnd',
        'category_id',
        'orderBy',
        'extraFields',
        'startsAt',
        'endsAt',
    ];

    /**
     * @example ?id=1,0
     * @param null|string $id
     * @return mixed
     */
    public function id($id = null)
    {
        if ( ! isset($id)){
            return $this->builder;
        }


        if (! is_array($id)) {
            $id = $id = explode(',',$id);
        }

        return $this->builder->whereIn('id', $id);
    }


    /**
     * @example ?active=1,0
     * @param null|string $active
     * @return mixed
     */
    public function active($active = null)
    {
        if ( ! isset($active)){
            return $this->builder;
        }

        //In case ?status=active,inactive
        if (! is_array($active)) {
            $active = $active = explode(',',$active);
        }

        return $this->builder->whereIn('active', $active);
    }

    /**
     * @example ?userId =1,10
     * @param null|string $user_id
     * @return mixed
     */
    public function userId($user_id = null)
    {
        if ( ! isset($user_id)){
            return $this->builder;
        }

        //In case ?status=user_id,inuser_id
        if (! is_array($user_id)) {
            $user_id = $user_id = explode(',',$user_id);
        }

        return $this->builder->whereIn('user_id', $user_id);
    }

    /**
     * @param null|string $title
     * @return $this
     */
    public function title($title = null)
    {
        $locale = App::getLocale();
        if ( ! $title){
            return $this->builder;
        }

        return $this->builder->where("title->{$locale}", 'LIKE', "%{$title}%");
    }

    public function slug($slug = null)
    {
        if ( ! $slug){
            return $this->builder;
        }

        return $this->builder->where("slug", 'LIKE', "%{$slug}%");
    }

    /**
     * @param null|string $description
     * @return $this
     */
    public function description($description = null)
    {
        $locale = App::getLocale();
        if ( ! $description){
            return $this->builder;
        }

        return $this->builder->where("description->{$locale}", 'LIKE', "%{$description}%");
    }

    /**
     * @param null|string $description_long
     * @return $this
     */
    public function description_long($description_long = null)
    {
        $locale = App::getLocale();
        if ( ! $description_long){
            return $this->builder;
        }

        return $this->builder->where("description_long->{$locale}", 'LIKE', "%{$description_long}%");
    }

    /**
     * @param null|string $category_id
     * @return $this
     */
    public function category_id($category_id = null)
    {
        if ( ! $category_id){
            return $this->builder;
        }

        if (! is_array($category_id)) {
            $category_id = $category_id = explode(',',$category_id);
        }

        return $this->builder->whereHas('categories', function ($q) use ($category_id){
            $q->whereIn('page_category_id', $category_id);
        });
    }

    /**
     * Needs to be the end of the month
     *
     * @param null $startsAt
     * @return $this|\Illuminate\Database\Eloquent\Builder
     */
    public function startsAt($startsAt = null)
    {
        if ( ! $startsAt){
            return $this->builder;
        }


        return ($this->request->has('startsAt') && $this->request->has('endsAt'))
            ? $this->builder->where('ends_at', '>=', Carbon::parse($startsAt))
            : $this->builder->where('starts_at', '>=', Carbon::parse($startsAt));
    }


    /**
     * needs to be current date
     *
     * @param null $endsAt
     * @return $this|\Illuminate\Database\Eloquent\Builder
     */
    public function endsAt($endsAt = null)
    {
        if ( ! $endsAt){
            return $this->builder;
        }

        return ($this->request->has('startsAt') && $this->request->has('endsAt'))
            ? $this->builder->where('starts_at', '<=', Carbon::parse($endsAt))
            : $this->builder->where('ends_at', '>=', Carbon::parse($endsAt));


    }

}